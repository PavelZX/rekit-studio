import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button, Form, Modal, message } from 'antd';
import { FormBuilder } from '../common';
import { execCoreCommand } from './redux/actions';
import plugin from '../../common/plugin';

export class CommonForm extends Component {
  static propTypes = {
    // dialog: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    formId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    actionContext: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    disabled: false,
    onCancel() {},
  };

  state = {
    pending: false,
    error: null,
  };

  componentDidMount() {
    this.getMeta().elements.forEach(ele => {
      if (ele.autoFocus) {
        requestAnimationFrame(() => {
          const node = document.getElementById(ele.key);
          if (node && node.focus) node.focus();
        });
      }

      if (ele.autoSelect) {
        requestAnimationFrame(() => {
          const node = document.getElementById(ele.key);
          if (node && node.select) node.select();
        });
      }
    });
  }

  getMeta() {
    const meta = {
      colon: true,
      columns: 1,
      disabled: this.state.pending,
      elements: [],
    };
    plugin.getPlugins('form.fillMeta').forEach(p =>
      p.form.fillMeta({
        context: this.props.actionContext,
        formId: this.props.formId,
        meta,
        values: this.props.form.getFieldsValue(),
      })
    );

    return meta;
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const { actionContext, formId } = this.props;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }

      // command will be the args of element.add(name, args);
      let command = {
        commandName: actionContext.action,
        type: actionContext.elementType,
        ...values,
        ..._.omit(actionContext, ['action', 'targetId', 'elementType']),
        context: actionContext,
        formId,
        values,
      };
      plugin.getPlugins('form.processValues').forEach(p => {
        p.form.processValues(command);
      });

      delete command.formId;
      if (command.values === values) delete command.values;
      if (command.context === actionContext) delete command.context;

      this.setState({ pending: true });
      // if (/^add|move|update$/.test(context.action)) {
      this.props.actions
        .execCoreCommand(command)
        .then(res => {
          if (res.error) {
            this.setState({ pending: false });
            Modal.error({
              title: 'Failed',
              content: (
                <span style={{ color: 'red' }}>{res.error}</span>
              ),
            });
            return;
          }
          this.props.onSubmit();
          this.setState({ pending: false });
          message.success(`${_.capitalize(actionContext.action)} ${actionContext.elementType} success.`);
        })
        .catch(err => {
          // Show error
          this.setState({ pending: false });
          Modal.error({
            title: 'Failed',
            content: (
              <span style={{ color: 'red' }}>{err.message ? err.message : 'Unknown error.'}</span>
            ),
          });
        });
      // } else {
      //   Modal.error({
      //     title: 'Error',
      //     content: <span style={{ color: 'red' }}>Unknown form action: {context.action}</span>,
      //   });
      //   this.setState({ pending: false });
      // }
    });
  };

  render() {
    const { pending } = this.state;
    return (
      <div className="core-common-form">
        <Form onSubmit={this.handleSubmit}>
          <FormBuilder meta={this.getMeta()} form={this.props.form} />
          <div className="form-footer">
            <Button onClick={this.props.onCancel} disabled={pending}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={pending}>
              {pending ? 'Loading...' : 'Ok'}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    dialog: state.dialog,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ execCoreCommand }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(CommonForm));
