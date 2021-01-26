import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

import Envelope from './envelope'
import EnvelopeStack from './envelope_stack'



class EnvelopeArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render() {
    if (!this.props.seat) {
      return (
        <div></div>
      );
    } else if (this.props.seat.isTeam1) {
      return (
        <Container style={{ width: "35%", top: "56%", left: "50%", marginLeft: "-17.5%", zIndex: "1", position: "absolute" }}>
          <Row>
            <Envelope
              isStarted={this.props.isStarted}
              updateEnvelope={this.updateEnvelope}
              activeEnvelope={this.props.activeEnvelope}
              gameId={this.props.gameId}
              seatId={this.props.seat.seatId}
              seatNumber={this.props.seat.seatNumber}
              isTeam1={this.props.seat.isTeam1}
              finishActiveEnvelope={this.props.finishActiveEnvelope}
              updateActiveEnvelope={this.props.updateActiveEnvelope}
            >
            </Envelope>
            <EnvelopeStack
              isStarted={this.props.isStarted}
              stackType={0}
              setActiveEnvelope={this.props.setActiveEnvelope}
              finishedEnvelopes={Array.from(this.props.finishedEnvelopes)}
              envelopes={this.props.envelopes}
              activeEnvelope={this.props.activeEnvelope}
              advanceEnvelopeSeat={this.props.advanceEnvelopeSeat}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container style={{ width: "35%", top: "56%", left: "50%", marginLeft: "-17.5%", zIndex: "1", position: "absolute" }}>
          <Row>
            <EnvelopeStack
              isStarted={this.props.isStarted}
              stackType={1}
              setActiveEnvelope={this.props.setActiveEnvelope}
              envelopes={this.props.envelopes}
              finishedEnvelopes={Array.from(this.props.finishedEnvelopes)}
              activeEnvelope={this.props.activeEnvelope}
              advanceEnvelopeSeat={this.props.advanceEnvelopeSeat}
            ></EnvelopeStack>
            <Envelope
              isStarted={this.props.isStarted}
              updateEnvelope={this.props.updateEnvelope}
              activeEnvelope={this.props.activeEnvelope}
              gameId={this.props.gameId}
              seatId={this.props.seat.seatId}
              seatNumber={this.props.seat.seatNumber}
              isTeam1={this.props.seat.isTeam1}
              finishActiveEnvelope={this.props.finishActiveEnvelope}
              updateActiveEnvelope={this.props.updateActiveEnvelope}
            >
            </Envelope>
            <EnvelopeStack
              isStarted={this.props.isStarted}
              stackType={0}
              envelopes={this.props.envelopes}
              finishedEnvelopes={Array.from(this.props.finishedEnvelopes)}
              setActiveEnvelope={this.props.setActiveEnvelope}
              activeEnvelope={this.props.activeEnvelope}
              advanceEnvelopeSeat={this.props.advanceEnvelopeSeat}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    }
  }


}

export default EnvelopeArea