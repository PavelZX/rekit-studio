import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DepsDiagram } from './';
import { getDepsDiagramData } from './selectors/getDepsDiagramData';

export default class DepsDiagramView extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    elementId: PropTypes.string.isRequired,
  };

  render() {
    const { elementById, elementId } = this.props;
    const { nodes, links } = getDepsDiagramData({ elementById, elementId });
    return (
      <div className="diagram-deps-diagram-view">
        <DepsDiagram nodes={nodes} links={links} targetId={elementId} />
      </div>
    );
  }
}
