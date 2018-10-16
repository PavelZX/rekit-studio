import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Icon, Menu, Modal } from 'antd';
import * as actions from './redux/actions';
import history from '../../common/history';
import { SearchInput, SvgIcon } from '../common';
import { showCmdDialog } from '../rekit-cmds/redux/actions';
import { About, DemoAlert, ProjectExplorer } from './';
import plugin from '../../common/plugin';

export class SidePanel extends Component {
  static propTypes = {
    // home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    aboutDialogVisible: process.env.REKIT_ENV === 'demo',
  };

  showAbout = () => {
    this.setState({
      aboutDialogVisible: true,
    });
  };

  hideAbout = () => {
    this.setState({
      aboutDialogVisible: false,
    });
  };

  getMenuItems() {
    const menuItems = [
      { icon: 'book', iconColor: '#29b6f6', text: 'Add Feature', key: 'add-feature' },
      { icon: 'notification', iconColor: '#ec407a', text: 'Add Action', key: 'add-action' },
      { icon: 'appstore-o', iconColor: '#F08036', text: 'Add Component', key: 'add-component' },
      { icon: 'code-o', iconColor: '#555', text: 'Show Output', key: 'show-output' },
    ];
    plugin.getPlugins('menu.mainMenu.fillMenuItems').forEach(p => {
      p.fillMenuItems(menuItems);
    });
    return menuItems;
  }
  showOutput() {
    this.props.actions.setBottomDrawerVisible(true);
    requestAnimationFrame(() => window.dispatchEvent(new window.Event('resize')));
  }

  handleMainMenuClick = evt => {
    switch (evt.key) {
      case 'add-feature':
      case 'add-component':
      case 'add-action':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      case 'show-output':
        this.showOutput();
        break;
      case 'deps':
        history.push('/config/deps');
        break;
      case 'build':
        history.push('/tools/build');
        break;
      case 'tests':
        history.push('/tools/tests');
        break;
      case 'test-coverage':
        history.push('/tools/coverage');
        break;
      case 'about':
        this.showAbout();
        break;
      default:
        break;
    }
  };

  renderMainMenu = () => {
    return (
      <Menu onClick={this.handleMainMenuClick} className="main-menu">
        {this.getMenuItems().map(mi => (
          <Menu.Item key={mi.key}>
            {mi.icon && (
              <span>
                <SvgIcon type={mi.icon} style={{ fill: mi.iconColor }} />
                {mi.text}
              </span>
            )}
          </Menu.Item>
        ))}
        <Menu.Item key="add-action">
          <Icon type="notification" style={{ color: '#ec407a' }} />Add Action
        </Menu.Item>
        <Menu.Item key="add-component">
          <Icon type="appstore-o" style={{ color: '#F08036' }} />Add Component
        </Menu.Item>
        <Menu.Item key="deps">
          <Icon type="appstore-o" style={{ color: 'transparent' }} />Dependencies
        </Menu.Item>
        <Menu.Item key="tests">
          <Icon type="appstore-o" style={{ color: 'transparent' }} />Run Tests
        </Menu.Item>
        <Menu.Item key="test-coverage">
          <Icon type="appstore-o" style={{ color: 'transparent' }} />Test Coverage
        </Menu.Item>
        <Menu.Item key="build">
          <Icon type="appstore-o" style={{ color: 'transparent' }} />Build
        </Menu.Item>
        <Menu.Item key="about">
          <Icon type="appstore-o" style={{ color: 'transparent' }} />About
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    // const { projectName, projectRoot, sidePanelWidth, demoAlertVisible } = this.props;
    // const prjName = projectName || projectRoot.split('/').pop();
    const demoAlertVisible = false;
    const { projectName } = this.props;
    return (
      <div className="home-side-panel dark-theme">
        <div className="header">
          <Link className="home-link" to="/" title={this.props.projectRoot}>
            <h5>
              <SvgIcon type="anticon-home" size={22} /> {projectName}
            </h5>
          </Link>
          <Dropdown overlay={this.renderMainMenu()}>
            <label>
              <Icon type="ellipsis" style={{ fontSize: '20px', fontWeight: 'bold' }} />
            </label>
          </Dropdown>
        </div>
        <ProjectExplorer />
        {this.state.aboutDialogVisible && (
          <Modal
            visible
            maskClosable
            title=""
            footer=""
            width={process.env.REKIT_ENV === 'demo' ? '760px' : '360px'}
            onCancel={this.hideAbout}
            style={{ top: '50px' }}
          >
            <About />
          </Modal>
        )}
        {demoAlertVisible && <DemoAlert onClose={this.props.actions.hideDemoAlert} />}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return _.pick(state.home, ['projectName', 'projectRoot', 'sidePanelWidth', 'demoAlertVisible']);
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, showCmdDialog }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
