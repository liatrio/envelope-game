import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope as faEnvelopeClear } from '@fortawesome/free-regular-svg-icons'

import {ReactComponent as ToDoFull} from './assets/stack_to-do_full.svg';
import {ReactComponent as ToDoHalf} from './assets/stack_to-do_half.svg';
import {ReactComponent as ToDoOne} from './assets/stack_to-do_one.svg';
import {ReactComponent as EnvOpen} from './assets/envelope_open.svg';
import {ReactComponent as IndexCard} from './assets/index-card.svg';
import {ReactComponent as EnvClosed} from './assets/envelope_closed.svg';

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Fade from 'react-bootstrap/Fade'





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
  }



  // handles checking the stamp to see if its correct
  // has a two second cooldown on clicking a button before it can be completed
  checkStamp(num) {
    let envelope = this.props.activeEnvelope;
    // update which stamps have been checked
    envelope.checked[num] = true;
    this.props.updateActiveEnvelope(envelope);
    this.setState({ waiting: true });
    setTimeout(() => {
      if (num === envelope.matchingStamp) {
        envelope.clientState = 3;
        envelope.stamped = true;
        this.setState({ waiting: false });
        this.props.updateActiveEnvelope(envelope);
      } else {
        this.setState({ waiting: false });
      }
    }, 500);
  }

  toggleOpen() {
    const open = this.state.open;
    let envelope = this.props.activeEnvelope;
    if (open && envelope.stamped) {
      envelope.clientState = 4;
      this.props.updateActiveEnvelope(envelope);
      this.setState({ open: !open });
    } else if (!open && !this.props.activeEnvelope.stamped) {
      envelope.clientState = 2;
      this.props.updateActiveEnvelope(envelope);
      this.setState({ open: !open });
    }
  }

  // helper function to return the right icon based on state
  getIcon() {
    if (!this.props.activeEnvelope) {
      return faEnvelope;
    }
    switch (this.props.activeEnvelope.envelopeState) {
      case 0:
        return faEnvelopeClear;
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
      <div style={{width: "70%", textAlign: "center"}}>
        {this.props.activeEnvelope ? `Stamp ${this.props.activeEnvelope.matchingStamp}` : "No envelope"}
        <br></br>
        <EnvOpen style={{margin: "0 auto", maxWidth: "50px"}} onClick={this.toggleOpen} aria-controls="collapse-stamp-bar" aria-expanded={open}/>
        <Fade
          in={open}
        >
          <div id="collapse-stamp-bar">
            <ButtonGroup aria-label="collapse-stamp-bar">
              {this.props.activeEnvelope ? this.props.activeEnvelope.random.map((i) => {
                const variant = i === this.props.activeEnvelope.matchingStamp ? "success" : "danger";
                return (
                  <Button
                    key={i}
                    variant={this.props.activeEnvelope.checked[i] ? variant : "primary"}
                    disabled={this.state.waiting || this.props.activeEnvelope.checked[i]}
                    onClick={() => this.checkStamp(i)}
                  >
                    {i}
                  </Button>
                )
              }) :
                <Button key={0}>1</Button>
              }
            </ButtonGroup>
          </div>

        </Fade>
        {this.props.activeEnvelope && this.props.activeEnvelope.envelopeId}
        <br></br>
        <Button
          variant={this.props.activeEnvelope && this.props.activeEnvelope.stamped && !this.state.open ? "primary" : "secondary"}
          disabled={!(this.props.activeEnvelope && this.props.activeEnvelope.stamped && !this.state.open)}
          onClick={() => this.props.finishActiveEnvelope()}
        >
          {
            this.props.is_team_1 ?
              "Send to next person" :
              "Finish envelope"
          }
        </Button>
      </div>
    );
  }
}


export default Envelope