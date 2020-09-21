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
      finished_envelopes: new Set().add({
        "envelope_id": "5v7cIDuymBQgrT6b",
        "matching_stamp": 7,
        "evelope_state": 0,
        "team": "Fr4fu64JE-T_anM-",
        "seat": null,
        "envelope_finish": null
      }),
      envelopes: [
        {
          "envelope_id": "-WwV6Sn8hU-9A5Iu",
          "matching_stamp": 1,
          "evelope_state": 0,
          "team": "Fr4fu64JE-T_anM-",
          "seat": null,
          "envelope_finish": null
        },
        {
          "envelope_id": "-XoIwECmkEiJ7ZXw",
          "matching_stamp": 18,
          "evelope_state": 0,
          "team": "Fr4fu64JE-T_anM-",
          "seat": null,
          "envelope_finish": null
        },
        {
          "envelope_id": "2HL1mS2VOdX51kIV",
          "matching_stamp": 18,
          "evelope_state": 0,
          "team": "Fr4fu64JE-T_anM-",
          "seat": null,
          "envelope_finish": null
        },
        {
          "envelope_id": "3ApVODVxZV6yKW85",
          "matching_stamp": 6,
          "evelope_state": 0,
          "team": "gP-b_lVFcB4kK6um",
          "seat": null,
          "envelope_finish": null
        },
        {
          "envelope_id": "3jgFBYaLrZXKdowO",
          "matching_stamp": 12,
          "evelope_state": 0,
          "team": "Fr4fu64JE-T_anM-",
          "seat": null,
          "envelope_finish": null
        },
        {
          "envelope_id": "5eosV9KxTB5BUjGZ",
          "matching_stamp": 10,
          "evelope_state": 0,
          "team": "Fr4fu64JE-T_anM-",
          "seat": null,
          "envelope_finish": null
        },
        {
          "envelope_id": "5v7cIDuymBQgrT6b",
          "matching_stamp": 7,
          "evelope_state": 0,
          "team": "Fr4fu64JE-T_anM-",
          "seat": null,
          "envelope_finish": null
        }
      ]
    }
    this.setActiveEnvelope = this.setActiveEnvelope.bind(this);
    this.finishActiveEnvelope = this.finishActiveEnvelope.bind(this);
  }

  setActiveEnvelope() {
    if (this.state.active_envelope === null && this.state.envelopes.length > 0) {
      // find an envelope that is not the active envelope and is not in the finished envelope set
      const unfinished_envelopes = this.state.envelopes.filter((e) => {
        return !this.state.finished_envelopes.has((i) => {
          return i.envelope_id === e.envelope_id;
        });
      });
      if (unfinished_envelopes.length > 0) {
        console.log();
        this.setState({ active_envelope: unfinished_envelopes[0] });
      }


      //this.setState({ active_envelope: envelope_id });
    }
  }

  finishActiveEnvelope(envelope_id) {

  }


  render() {
    if (this.props.is_team_1) {
      return (
        <Container>
          <Row>
            <div className={this.state.active_envelope === null ? "invisible" : "visible"}>
              <Envelope
                active_envelope={this.state.active_envelope}
              >
              </Envelope>
            </div>
            <EnvelopeStack
              stack_type={0}
              setActiveEnvelope={this.setActiveEnvelope}
              finished_count={this.state.finished_envelopes.size}
              count={this.state.envelopes.length}
              active_envelope={this.state.active_envelope}
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
              count={this.state.envelopes.length}
              finished_count={this.state.finished_envelopes.size}
              active_envelope={this.state.active_envelope}
            ></EnvelopeStack>
            <div className={this.state.active_envelope === null ? "invisible" : "visible"}>
              <Envelope
                active_envelope={this.state.active_envelope}
              >
              </Envelope>
            </div>
            <EnvelopeStack
              stack_type={0}
              count={this.state.envelopes.length}
              finished_count={this.state.finished_envelopes.size}
              setActiveEnvelope={this.setActiveEnvelope}
              active_envelope={this.state.active_envelope}
            ></EnvelopeStack>
          </Row>
        </Container>
      );
    }
  }


}

export default EnvelopeArea