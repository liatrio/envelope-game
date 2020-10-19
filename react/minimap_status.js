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
        <Row>
          <Col>
            <EnvClosed style={{padding: "3px"}}/>
          </Col>
          <Col>
            <EnvToDo style={{padding: "3px"}}/>
            <Badge>
              {this.props.envelopes ? this.getReadyEnveleopes() : 0}
            </Badge>              
          </Col>
          <Col className="invisible">
          </Col>
          
        </Row>
      );
    }

    return (
      <Row>
        <Col>
        <EnvToDo style={{padding: "3px"}}/>
          <Badge>
            {this.props.envelopes ? this.getReadyEnveleopes() : 0}
          </Badge>
        </Col>
        <Col>
          <EnvClosed style={{padding: "3px"}}/>
        </Col>
        <Col>
        <EnvDone style={{padding: "3px"}}/>
          <Badge>
            {this.props.envelopes ? this.getFinishedEnvelopes() : 0}
          </Badge>
        </Col>
        
        
      </Row>
    );

  }


}

export default MinimapStatus