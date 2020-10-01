import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope as faEnvelopeClear } from '@fortawesome/free-regular-svg-icons'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import MinimapStatus from './minimap_status'


class Minimap extends Component {

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