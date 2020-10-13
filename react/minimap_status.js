import React, { Component } from 'react'


import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import EnvClosed from './assets/icon_stack_current.svg';
import EnvToDo from './assets/icon_stack_to-do.svg';
import EnvDone from './assets/icon_stack_finished.svg';

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
          </Col>
          <Col>
            <EnvClosed style={{padding: "5px"}} size='7x'/>
          </Col>
          <Col>
            <Row>
            <EnvToDo style={{padding: "5px"}}/>
              <Badge>
                {this.props.envelopes ? this.getReadyEnveleopes() : 0}
              </Badge>
              
            </Row>


          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col>
          <Row>
          <EnvClosed style={{padding: "5px"}}/>
            <Badge>
              {this.props.envelopes ? this.getReadyEnveleopes() : 0}
            </Badge>
          </Row>

        </Col>
        <Col>
        <EnvDone style={{padding: "5px"}}/>
        </Col>

        <Col>
        <EnvToDo style={{padding: "5px"}}/>
          <Badge>
            {this.props.envelopes ? this.getFinishedEnvelopes() : 0}
          </Badge>
        </Col>
      </Row>
    );

  }


}

export default MinimapStatus