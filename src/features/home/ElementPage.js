import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CodeEditor } from '../editor';
import { includeFile } from './redux/actions';
import plugin from '../../common/plugin';
import { DepsDiagramView } from '../diagram';
import { ImageView } from './';

const CodeView = ({ element, viewElement, match }) => (
  <CodeEditor
    file={(viewElement && viewElement.target) || element.target || element.id}
    match={match}
  />
);
const DepsDiagramViewWrapper = ({ element, viewElement, elementById }) => (
  <DepsDiagramView elementId={element.id} elementById={elementById} />
);

export class ElementPage extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    elements: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  getElement() {
    const { elementId } = this.props.match.params;
    const eleId = decodeURIComponent(elementId);
    return this.byId(eleId);
  }
  getViewElement(ele) {
    if (!ele.views || !ele.views.length) {
      return null;
    }
    const { view } = this.props.match.params;
    if (!view) return _.find(ele.views, 'isDefault') || ele.views[0];
    else return _.find(ele.views, p => p.key === view);
  }
  // Get the view component to show the element
  getView(ele, viewEle) {
    let View = null;
    // Get view from plugins
    plugin
      .getPlugins('view.getView')
      .reverse()
      .some(p => {
        View = p.view.getView(ele, viewEle ? viewEle.key : null);
        if (View) return true;
        return 0;
      });
    if (View) return View;

    if (!viewEle) {
      const realEle = ele.target ? this.byId(ele.target) : ele;
      if (realEle && realEle.type === 'file') {
        if (/^png|jpg|jpeg|gif|bmp|webp$/i.test(realEle.ext)) return ImageView;
        if (realEle.size < 1000000) return CodeView;
        else return 'TOO_LARGE';
      }
      return null;
    } else if (viewEle.key === 'diagram') {
      // Show default deps diagram for normal js files
      return DepsDiagramViewWrapper;
    } else if (
      viewEle.target &&
      this.byId(viewEle.target) &&
      this.byId(viewEle.target).type === 'file'
    ) {
      return CodeView;
    }
    return null;
  }

  byId = id => this.props.elementById[id];

  loadOtherFile(file) {
    // Other file means the file is not included in project data
    // Fox example, show a file in node_modules.

    const { includeFilePending, includeFileError, otherFiles } = this.props;
    if (!includeFilePending && !includeFileError && !otherFiles[file]) {
      this.props.actions.includeFile(file);
    }
    if (includeFileError) {
      if (_.get(includeFileError, 'response.status') === 404) {
        return <div className="home-element-page error"> File not found: {file} </div>;
      }
    }
    return <div className="home-element-page loading"> Loading... </div>;
  }

  renderNotFound(eleId) {
    return (
      <div className="home-element-page error">
        Element not found: {eleId}, please check URL or if the element exists.
      </div>
    );
  }

  renderNotSupported() {
    return <div className="home-element-page error">The element/view is not supported.</div>;
  }

  renderSizeTooLarge(ele) {
    return (
      <div className="home-element-page error">
        The file size is too large to show, please try other native code editors: {ele.id}.
      </div>
    );
  }

  render() {
    const { elementById } = this.props;
    const ele = this.getElement();
    if (!ele) {
      const { elementId } = this.props.match.params;
      const eleId = decodeURIComponent(elementId);
      // If element not exists, try to add it to the project.
      return this.loadOtherFile(eleId);
    }

    const viewEle = this.getViewElement(ele);

    if (viewEle && viewEle.target && !this.byId(viewEle.target)) {
      return this.renderNotFound(viewEle.target);
    }

    const View = this.getView(ele, viewEle);
    if (View === 'TOO_LARGE') {
      return this.renderSizeTooLarge(ele);
    }
    if (!View) {
      return this.renderNotSupported();
    }
    return (
      <div className="home-element-page">
        <View
          elementById={elementById}
          element={ele}
          viewElement={viewEle}
          match={this.props.match}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ..._.pick(state.home, ['elementById', 'elements', 'includeFilePending', 'includeFileError', 'otherFiles']),
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ includeFile }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ElementPage);
