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
        <div>
        <Row style={{fontFamily: "Courier", textAlign: "center"}}>{this.props.displayName}</Row>
        <Row md={5} lg={5} sm={5}>
          <Col style={{padding: "0"}}>
          <EnvToDo style={{padding: "3px"}}/>
          </Col>
          <Col md="auto" lg="auto" sm="auto" style={{padding: "0"}}>
          <Badge>
              {this.props.envelopes ? this.getReadyEnveleopes() : 0}
            </Badge>
          </Col>
          <Col style={{padding: "0"}}>
            <EnvClosed style={{padding: "3px"}}/>
          </Col>
          <Col style={{padding: "0"}}>
          </Col>
          <Col md="auto" lg="auto" sm="auto" style={{padding: "0"}}>
          </Col>
        </Row>
      </div>
      );
    }

    return (
      <div>
        <Row style={{fontFamily: "Courier", textAlign: "center"}}>{this.props.displayName}</Row>
        <Row md={5} lg={5} sm={5}>
          <Col style={{padding: "0"}}>
          <EnvToDo style={{padding: "3px"}}/>
          </Col>
          <Col md="auto" lg="auto" sm="auto" style={{padding: "0"}}>
          <Badge>
              {this.props.envelopes ? this.getReadyEnveleopes() : 0}
            </Badge>
          </Col>
          <Col style={{padding: "0"}}>
            <EnvClosed style={{padding: "3px"}}/>
          </Col>
          <Col style={{padding: "0"}}>
            <EnvDone style={{padding: "3px"}}/>
          </Col>
          <Col md="auto" lg="auto" sm="auto" style={{padding: "0"}}>
          <Badge>
              {this.props.envelopes ? this.getFinishedEnvelopes() : 0}
            </Badge>
          </Col>
        </Row>
      </div>
    );

  }


}

export default MinimapStatus