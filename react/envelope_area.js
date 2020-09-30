import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'


import Envelope from './envelope'
import EnvelopeStack from './envelope_stack'



class EnvelopeArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active_envelope: null,
      finished_envelopes: new Set(),
    }
    this.advanceEnvelopeSeat = this.advanceEnvelopeSeat.bind(this);
    this.setActiveEnvelope = this.setActiveEnvelope.bind(this);
    this.finishActiveEnvelope = this.finishActiveEnvelope.bind(this);
    this.updateCheckedStamps = this.updateCheckedStamps.bind(this);
    this.updateActiveEnvelope = this.updateActiveEnvelope.bind(this);
  }

  setActiveEnvelope() {
    if (this.props.envelopes && this.state.active_envelope === null && this.props.envelopes.length > 0) {
      // find an envelope that is not the active envelope and is not in the finished envelope set
      let unfinished_envelopes = this.props.envelopes.filter((e) => {
        return !this.state.finished_envelopes.has(e.envelope_id);
      });
      console.log(unfinished_envelopes);
      if (unfinished_envelopes.length > 0) {
        unfinished_envelopes[0].complete = false;
        unfinished_envelopes[0].stamped = false;
        unfinished_envelopes[0].envelope_state = 1;
        unfinished_envelopes[0].random = Array.from(Array(5), (x, i) => i + unfinished_envelopes[0].matching_stamp).sort(() => Math.random() - 0.5);
        unfinished_envelopes[0].checked = Array(5).fill(false, 0, 5);
        this.setState({ active_envelope: unfinished_envelopes[0] });
        this.updateActiveEnvelope(unfinished_envelopes[0], 1);
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
    const request = `/api/update-envelope/${this.props.game_id}/${envelope.envelope_id}/${this.props.seat_number}/${envelope.envelope_state}`;
    const response = await fetch(request);
    const json = await response.json();
    console.log(json);
    this.setState({ active_envelope: envelope });
  }

  updateCheckedStamps(checked) {
    let envelope = this.state.active_envelope;
    envelope.checked = checked;
    this.setState({ active_envelope: envelope })
  }

  finishActiveEnvelope() {
    let finished = this.state.finished_envelopes;
    finished.add(this.state.active_envelope.envelope_id);
    if (this.props.is_team_1) {
      this.advanceEnvelopeSeat([this.state.active_envelope.envelope_id]);
      this.setState({ active_envelope: null, finished_envelopes: finished });
    } else {
      this.setState({ active_envelope: null, finished_envelopes: finished });
    }
  }

  async advanceEnvelopeSeat(envelopes) {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        envelopes: envelopes,
        game_id: this.props.game_id,
        team_id: this.props.team_id,
        next_seat: this.props.seat_number + 1,
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
              active_envelope={this.state.active_envelope}
              game_id={this.props.game_id}
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
              finished_envelopes={Array.from(this.state.finished_envelopes)}
              envelopes={this.props.envelopes}
              active_envelope={this.state.active_envelope}
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
              finished_envelopes={Array.from(this.state.finished_envelopes)}
              active_envelope={this.state.active_envelope}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
            <Envelope
              active_envelope={this.state.active_envelope}
              game_id={this.props.game_id}
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
              finished_envelopes={Array.from(this.state.finished_envelopes)}
              setActiveEnvelope={this.setActiveEnvelope}
              active_envelope={this.state.active_envelope}
              advanceEnvelopeSeat={this.advanceEnvelopeSeat}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    }
  }


}

export default EnvelopeArea