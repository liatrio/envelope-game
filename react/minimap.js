import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import MinimapStatus from './minimap_status'

class Minimap extends Component {

  getDisplayName(seatNumber) {
    for (var s in this.props.seats) {
      if (s.seatNumber === seatNumber) {
        return s.displayName;
      }
    }
  }

  render() {

    return (
      <Container fluid>
        <Row>Game Progress</Row>
        <Row>
          <Col lg={false}>
            
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={0}
              isTeam1={1}
            >
           {this.getDisplayName(0)}
            </MinimapStatus>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={1}
              isTeam1={1}
            >
            </MinimapStatus>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={2}
              isTeam1={1}
            >
            </MinimapStatus>
          </Col>
          <Col lg={false}>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={0}
              isTeam1={0}
            >
            </MinimapStatus>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={1}
              isTeam1={0}
            >
            </MinimapStatus>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={2}
              isTeam1={0}
            >
            </MinimapStatus>
          </Col>
        </Row>
      </Container>
    );
  }

}

export default Minimap