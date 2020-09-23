import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Collapse from 'react-bootstrap/Collapse'




class Envelope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      waiting: false
    };
    this.checkStamp = this.checkStamp.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.getIcon = this.getIcon.bind(this);
    this.updateEnvelope = this.updateEnvelope.bind(this);
  }

  // updates envelope states
  // 0 is on todo stack
  // 1 is closed, active envelope
  // 2 is open active envelope
  // 3 stamped open envelope
  // 4 is stamped closed envelope
  // 5 is completed for that person
  async updateEnvelope(id, state) {
    const request = `/api/update-envelope/${this.props.game_id}/${id}/${this.props.seat_id}/${state}`;
    console.log(request);
    // make request to update envelope(s)
    // const response = await fetch();
    // const json = await response.json();
  }

  // handles checking the stamp to see if its correct
  // has a two second cooldown on clicking a button before it can be completed
  checkStamp(num) {
    let envelope = this.props.active_envelope;
    // update which stamps have been checked
    envelope.checked[num] = true;
    this.props.updateActiveEnvelope(envelope);
    this.setState({ waiting: true });
    setTimeout(() => {
      if (num === envelope.matching_stamp) {
        // envelope stamp should become 3 here
        envelope.stamped = true;
        this.setState({ waiting: false });
        this.props.updateActiveEnvelope(envelope, 3);
      } else {
        this.setState({ waiting: false });
      }
    }, 2000);
  }

  async toggleOpen() {
    const open = this.state.open;
    if (open && this.props.active_envelope.stamped) {
      this.setState({ open: !open });
    } else if (!open && !this.props.active_envelope.stamped) {
      await this.updateEnvelope(this.props.active_envelope.envelope_id, 1);
      this.setState({ open: !open });
    }
  }

  // helper function to return the right icon based on state
  getIcon() {
    if (!this.props.active_envelope) {
      return faEnvelope;
    }
    switch (this.props.active_envelope.envelope_state) {
      case 0:
        return faEnvelope;
      case 1:
        return faEnvelope;
      case 2:
        return faEnvelopeOpen;
      case 3:
        return faEnvelopeOpenText;
      case 4:
        return faEnvelopeSquare;
      case 5:
        return faEnvelope;
      default:
        return faEnvelope;
    }
  }

  render() {
    const open = this.state.open;
    return (
      <div>
        {this.props.active_envelope && `Stamp ${this.props.active_envelope.matching_stamp}`}
        <br></br>
        <FontAwesomeIcon
          icon={this.getIcon()}
          size='5x'
          onClick={this.toggleOpen}
          aria-controls="collapse-stamp-bar"
          aria-expanded={open}
        />
        <Collapse
          in={open}
        >
          <div id="collapse-stamp-bar">
            <ButtonGroup aria-label="collapse-stamp-bar">
              {this.props.active_envelope && this.props.active_envelope.random.map((i) => {
                const variant = i === this.props.active_envelope.matching_stamp ? "success" : "danger";
                return (
                  <Button
                    key={i}
                    variant={this.props.active_envelope.checked[i] ? variant : "primary"}
                    disabled={this.state.waiting || this.props.active_envelope.checked[i]}
                    onClick={() => this.checkStamp(i)}
                  >
                    {i}
                  </Button>
                )
              })}
            </ButtonGroup>
          </div>

        </Collapse>
        <br></br>
        {this.props.active_envelope && this.props.active_envelope.envelope_id}
        <br></br>
        {
          this.props.active_envelope && this.props.active_envelope.stamped && !this.state.open &&
          <Button
            onClick={this.props.finishActiveEnvelope}
          >
            {
              this.props.is_team_1 ?
                "Send to next person" :
                "Finish envelope"
            }
          </Button>

        }
      </div>
    );
  }
}


export default Envelope