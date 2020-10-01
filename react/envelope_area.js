import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'


import Envelope from './envelope'
import EnvelopeStack from './envelope_stack'



class EnvelopeArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEnvelopes: null,
      finishedEnvelopes: new Set(),
    }
    this.advanceEnvelopeSeat = this.advanceEnvelopeSeat.bind(this);
    this.setActiveEnvelope = this.setActiveEnvelope.bind(this);
    this.finishActiveEnvelope = this.finishActiveEnvelope.bind(this);
    this.updateCheckedStamps = this.updateCheckedStamps.bind(this);
    this.updateActiveEnvelope = this.updateActiveEnvelope.bind(this);
  }

  setActiveEnvelope() {
    if (this.props.envelopes && this.state.activeEnvelopes === null && this.props.envelopes.length > 0) {
      // find an envelope that is not the active envelope and is not in the finished envelope set
      let unfinishedEnvelopes = this.props.envelopes.filter((e) => {
        return !this.state.finishedEnvelopes.has(e.envelope_id);
      });
      console.log(unfinishedEnvelopes);
      if (unfinishedEnvelopes.length > 0) {
        unfinishedEnvelopes[0].complete = false;
        unfinishedEnvelopes[0].stamped = false;
        unfinishedEnvelopes[0].envelopeState = 1;
        unfinishedEnvelopes[0].random = Array.from(Array(5), (x, i) => i + unfinishedEnvelopes[0].matching_stamp).sort(() => Math.random() - 0.5);
        unfinishedEnvelopes[0].checked = Array(5).fill(false, 0, 5);
        this.setState({ activeEnvelopes: unfinishedEnvelopes[0] });
        this.updateActiveEnvelope(unfinishedEnvelopes[0], 1);
      } else {
        console.log("couldn't find envelopes to do");
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
    const request = `/api/update-envelope/${this.props.gameId}/${envelope.envelope_id}/${this.props.seat_number}/${envelope.envelopeState}`;
    const response = await fetch(request);
    const json = await response.json();
    console.log(json);
    this.setState({ activeEnvelopes: envelope });
  }

  updateCheckedStamps(checked) {
    let envelope = this.state.activeEnvelopes;
    envelope.checked = checked;
    this.setState({ activeEnvelopes: envelope })
  }

  finishActiveEnvelope() {
    let finished = this.state.finishedEnvelopes;
    finished.add(this.state.activeEnvelopes.envelope_id);
    if (this.props.is_team_1) {
      this.advanceEnvelopeSeat([this.state.activeEnvelopes.envelope_id]);
      this.setState({ activeEnvelopes: null, finishedEnvelopes: finished });
    } else {
      this.setState({ activeEnvelopes: null, finishedEnvelopes: finished });
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
        nextSeat: this.props.seat_number + 1,
      })
    };
    await fetch('/api/move-envelope', requestOptions);
  }

  render() {
    if (this.props.is_team_1) {
      return (
        <Container>
          <Row>
            <Envelope
              activeEnvelopes={this.state.activeEnvelopes}
              gameId={this.props.gameId}
              seat_id={this.props.seat_id}
              seat_number={this.props.seat_number}
              is_team_1={this.props.is_team_1}
              finishActiveEnvelope={this.finishActiveEnvelope}
              updateCheckedStamps={this.updateCheckedStamps}
              updateActiveEnvelope={this.updateActiveEnvelope}
            >
            </Envelope>
            <EnvelopeStack
              stack_type={0}
              setActiveEnvelope={this.setActiveEnvelope}
              finishedEnvelopes={Array.from(this.state.finishedEnvelopes)}
              envelopes={this.props.envelopes}
              activeEnvelopes={this.state.activeEnvelopes}
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
              stack_type={1}
              setActiveEnvelope={this.setActiveEnvelope}
              envelopes={this.props.envelopes}
              finishedEnvelopes={Array.from(this.state.finishedEnvelopes)}
              activeEnvelopes={this.state.activeEnvelopes}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
            <Envelope
              activeEnvelopes={this.state.activeEnvelopes}
              gameId={this.props.gameId}
              seat_id={this.props.seat_id}
              seat_number={this.props.seat_number}
              is_team_1={this.props.is_team_1}
              finishActiveEnvelope={this.finishActiveEnvelope}
              updateCheckedStamps={this.updateCheckedStamps}
              updateActiveEnvelope={this.updateActiveEnvelope}
            >
            </Envelope>
            <EnvelopeStack
              stack_type={0}
              envelopes={this.props.envelopes}
              finishedEnvelopes={Array.from(this.state.finishedEnvelopes)}
              setActiveEnvelope={this.setActiveEnvelope}
              activeEnvelopes={this.state.activeEnvelopes}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    }
  }


}

export default EnvelopeArea