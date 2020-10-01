import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, faEnvelopeSquare, faMailBulk } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope as faEnvelopeClear } from '@fortawesome/free-regular-svg-icons'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
            <FontAwesomeIcon
              icon={faEnvelope}
            >
            </FontAwesomeIcon>
          </Col>
          <Col>
            <Row>
              <Badge>
                {this.props.envelopes ? this.getReadyEnveleopes() : 0}
              </Badge>
              <FontAwesomeIcon
                icon={faMailBulk}
              >
              </FontAwesomeIcon>
            </Row>


          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col>
          <Row>
            <FontAwesomeIcon
              icon={faMailBulk}
            >
            </FontAwesomeIcon>
            <Badge>
              {this.props.envelopes ? this.getReadyEnveleopes() : 0}
            </Badge>
          </Row>

        </Col>
        <Col>
          <FontAwesomeIcon
            icon={faEnvelope}
          >
          </FontAwesomeIcon>
        </Col>

        <Col>
          <FontAwesomeIcon
            icon={faMailBulk}
          >
          </FontAwesomeIcon>
          <Badge>

          </Badge>
        </Col>
      </Row>
    );

  }


}

export default MinimapStatus