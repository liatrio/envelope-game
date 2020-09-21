import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, far, fas } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Collapse from 'react-bootstrap/Collapse'




class Envelope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      envelope_state: 0,
      open: false,
      waiting: false,
      complete: false,
      random: Array.from(Array(5), (x, i) => i + 5).sort(() => Math.random() - 0.5),
      checked: Array(5).fill(false, 0, 5)
    };
    this.checkStamp = this.checkStamp.bind(this);
  }

  async updateEnvelope(id, state) {

  }

  generateNumbers() {
    Array.from(Array(5), (x, i) => i + this.props.active_envelope.matching_stamp).sort(() => Math.random() - 0.5);
  }

  checkStamp(num) {
    let checked = this.state.checked;
    checked[num] = true;
    this.setState({ waiting: true, checked: checked });
    setTimeout(() => {
      if (num === this.state.matching_stamp) {
        this.setState({ waiting: false, checked: checked, complete: true, open: false });
      } else {
        this.setState({ waiting: false, checked: checked });
      }
    }, 2000);
  }


  render() {
    const { open } = this.state;
    const stamp_buttons = this.state.random.map((i) => {
      let variant;
      if (i === this.state.matching_stamp) {
        variant = "success";
      } else {
        variant = "danger";
      }
      return (
        <Button
          key={i}
          variant={this.state.checked[i] ? variant : "primary"}
          disabled={this.state.waiting || this.state.checked[i]}
          onClick={() => this.checkStamp(i)}
        >
          {i}
        </Button>

      )
    });

    return (
      <div>
        Envelope number {this.state.matching_stamp}
        <br></br>
        <FontAwesomeIcon
          icon={this.state.envelope_state !== 1 ? faEnvelope : faEnvelopeOpen} size='5x'
          onClick={() => this.setState({ open: !open })}
          aria-controls="collapse-stamp-bar"
          aria-expanded={open}
        />
        <Collapse
          in={open}
        >
          <div id="collapse-stamp-bar">
            <ButtonGroup aria-label="collapse-stamp-bar">
              {stamp_buttons}
            </ButtonGroup>
          </div>

        </Collapse>
        <br></br>
        {this.props.active_envelope !== null ? this.props.active_envelope.envelope_id : ""}
      </div>
    );
  }
}


export default Envelope