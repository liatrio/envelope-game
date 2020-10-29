import React, { Component } from 'react'


import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {ReactComponent as EnvClosed} from './assets/icon_stack_current.svg';
import {ReactComponent as EnvToDo} from './assets/icon_stack_to-do.svg';
import {ReactComponent as EnvDone} from './assets/icon_stack_finished.svg';

import Badge from 'react-bootstrap/Badge'

class MinimapStatus extends Component {
  constructor(props) {
    super(props);
    this.getReadyEnveleopes = this.getReadyEnveleopes.bind(this);
    this.getFinishedEnvelopes = this.getFinishedEnvelopes.bind(this);
  }


  getReadyEnveleopes() {
    return this.props.envelopes.filter((e) => {
      return (e.seatNumber === this.props.seatNumber && e.envelopeState === 0 && e.isTeam1 === this.props.isTeam1)
    }).length;
  }

  getFinishedEnvelopes() {
    return this.props.envelopes.filter((e) => {
      return (e.seatNumber === this.props.seatNumber && e.envelopeState === 5);
    }).length;
  }

  render() {
    
    if (this.props.isTeam1) {
      return (
        <div className="player-stats">
          <div className="display-name">{this.props.displayName ? this.props.displayName : 'Player'}</div>
          <div className="display-count">{this.props.envelopes ? this.getReadyEnveleopes() : 0}</div>
      </div>
      );
    }

    return (
      <div>
         <div className="player-stats">
            <div className="display-name">{this.props.displayName ? this.props.displayName : 'Player'}</div>
            <div className="display-count batch-count-1">{this.props.envelopes ? this.getReadyEnveleopes() : 0}</div>
            <div className="display-count batch-count-2">{this.props.envelopes ? this.getFinishedEnvelopes() : 0}</div>
          </div>
      </div>
    );

  }


}

export default MinimapStatus