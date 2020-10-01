import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'


import Envelope from './envelope'
import EnvelopeStack from './envelope_stack'



class EnvelopeArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEnvelope: null,
      finishedEnvelopes: new Set(),
    }
    this.advanceEnvelopeSeat = this.advanceEnvelopeSeat.bind(this);
    this.setActiveEnvelope = this.setActiveEnvelope.bind(this);
    this.finishActiveEnvelope = this.finishActiveEnvelope.bind(this);
    this.updateCheckedStamps = this.updateCheckedStamps.bind(this);
    this.updateActiveEnvelope = this.updateActiveEnvelope.bind(this);
    this.updateEnvelope = this.updateEnvelope.bind(this);
  }

  // updates envelope states
  // 0 is on todo stack
  // 1 is closed, active envelope
  // 2 is open active envelope
  // 3 stamped open envelope
  // 4 is stamped closed envelope
  // 5 is completed for that person
  async updateEnvelope(envelope) {
    const request = `/api/update-envelope/${this.props.gameId}/${envelope.envelopeId}/${envelope.clientState}`;
    console.log(request);
    await (await fetch(request)).json();
  }

  setActiveEnvelope() {
    if (this.props.envelopes && this.state.activeEnvelope === null && this.props.envelopes.length > 0) {
      // find an envelope that is not the active envelope and is not in the finished envelope set
      let unfinishedEnvelopes = this.props.envelopes.filter((e) => {
        return !this.state.finishedEnvelopes.has(e.envelopeId);
      });
      console.log(unfinishedEnvelopes);
      if (unfinishedEnvelopes.length > 0) {
        unfinishedEnvelopes[0].complete = false;
        unfinishedEnvelopes[0].stamped = false;
        unfinishedEnvelopes[0].envelopeState = 1;
        unfinishedEnvelopes[0].random = Array.from(Array(5), (x, i) => i + unfinishedEnvelopes[0].matchingStamp).sort(() => Math.random() - 0.5);
        unfinishedEnvelopes[0].checked = Array(5).fill(false, 0, 5);
        unfinishedEnvelopes[0].clientState = 1;
        this.setState({ activeEnvelope: unfinishedEnvelopes[0] });
        this.updateActiveEnvelope(unfinishedEnvelopes[0]);
        this.updateEnvelope(unfinishedEnvelopes[0]);
      }
    }
  }

  // updates the active envelope's states
  // 0 is on todo stack
  // 1 is closed, active envelope
  // 2 is open active envelope
  // 3 stamped open envelope
  // 4 is stamped closed envelope
  // 5 is completed for that person
  async updateActiveEnvelope(envelope) {
    const request = `/api/update-envelope/${this.props.gameId}/${envelope.envelopeId}/${envelope.clientState}`;
    await fetch(request);
    this.setState({ activeEnvelope: envelope });
  }

  updateCheckedStamps(checked) {
    let envelope = this.state.activeEnvelope;
    envelope.checked = checked;
    this.setState({ activeEnvelope: envelope })
  }

  finishActiveEnvelope() {
    let finished = this.state.finishedEnvelopes;
    finished.add(this.state.activeEnvelope.envelopeId);
    if (this.props.isTeam1) {
      this.advanceEnvelopeSeat([this.state.activeEnvelope.envelopeId]);
      this.setState({ activeEnvelope: null, finishedEnvelopes: finished });
    } else {
      this.setState({ activeEnvelope: null, finishedEnvelopes: finished });
    }
  }

  async advanceEnvelopeSeat(envelopes) {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        envelopes: envelopes,
        gameId: this.props.gameId,
        teamId: this.props.teamId,
        nextSeat: this.props.seatNumber + 1,
      })
    };
    await fetch('/api/move-envelope', requestOptions);
  }

  render() {
    if (this.props.isTeam1) {
      return (
        <Container>
          <Row>
            <Envelope
              updateEnvelope={this.updateEnvelope}
              activeEnvelope={this.state.activeEnvelope}
              gameId={this.props.gameId}
              seatId={this.props.seatId}
              seatNumber={this.props.seatNumber}
              isTeam1={this.props.isTeam1}
              finishActiveEnvelope={this.finishActiveEnvelope}
              updateCheckedStamps={this.updateCheckedStamps}
              updateActiveEnvelope={this.updateActiveEnvelope}
            >
            </Envelope>
            <EnvelopeStack
              stackType={0}
              setActiveEnvelope={this.setActiveEnvelope}
              finishedEnvelopes={Array.from(this.state.finishedEnvelopes)}
              envelopes={this.props.envelopes}
              activeEnvelope={this.state.activeEnvelope}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <Row>
            <EnvelopeStack
              stackType={1}
              setActiveEnvelope={this.setActiveEnvelope}
              envelopes={this.props.envelopes}
              finishedEnvelopes={Array.from(this.state.finishedEnvelopes)}
              activeEnvelope={this.state.activeEnvelope}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
            <Envelope
              updateEnvelope={this.updateEnvelope}
              activeEnvelope={this.state.activeEnvelope}
              gameId={this.props.gameId}
              seatId={this.props.seatId}
              seatNumber={this.props.seatNumber}
              isTeam1={this.props.isTeam1}
              finishActiveEnvelope={this.finishActiveEnvelope}
              updateCheckedStamps={this.updateCheckedStamps}
              updateActiveEnvelope={this.updateActiveEnvelope}
            >
            </Envelope>
            <EnvelopeStack
              stackType={0}
              envelopes={this.props.envelopes}
              finishedEnvelopes={Array.from(this.state.finishedEnvelopes)}
              setActiveEnvelope={this.setActiveEnvelope}
              activeEnvelope={this.state.activeEnvelope}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    }
  }


}

export default EnvelopeArea