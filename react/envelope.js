import React, { Component } from 'react'

import envOpen from './assets/envelope_open.svg';
import envClosed from './assets/envelope_closed.svg';
import envChanged from './assets/envelope_bugged.svg';
import envOpenIdx from './assets/envelope_open_index-card.svg';
import envOk from './assets/envelope_ok.svg';

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
    this.getEnvelope = this.getEnvelope.bind(this);
    this.fixBug = this.fixBug.bind(this);
  }

  // handles checking the stamp to see if its correct
  // has a two second cooldown on clicking a button before it can be completed
  checkStamp(num) {
    console.log("Inside CheckStamp");
    let envelope = this.props.activeEnvelope;
    console.log(this.props.activeEnvelope);
    // update which stamps have been checked
    console.log("Before the If Statement");
    console.log(envelope);
    console.log(this.props.activeEnvelope.prevCompleted === true && this.props.activeEnvelope.isChanged === true && this.props.activeEnvelope.seatNumber === 2);
    if (this.props.activeEnvelope.prevCompleted === true && this.props.activeEnvelope.isChanged === true && this.props.activeEnvelope.seatNumber === 2) {
      //await fetch('/api/set-changed/envelope.envelope_id');
      console.log("Inside the IF Statement");
      this.fixBug(this.props.activeEnvelope);
      this.props.activeEnvelope.isChanged = false;
    }
    console.log("After the if statement");
    this.props.activeEnvelope.checked[num] = true;
    this.props.updateActiveEnvelope(this.props.activeEnvelope);
    this.setState({ waiting: true });
    setTimeout(() => {
      if (num === this.props.activeEnvelope.matchingStamp) {
        this.props.activeEnvelope.clientState = 3;
        this.props.activeEnvelope.stamped = true;
        this.setState({ waiting: false });
        this.props.updateActiveEnvelope(this.props.activeEnvelope);
      } else {
        this.setState({ waiting: false });
      }
    }, 500);
  }

  async fixBug(envelope) {
    let filteredEnv = envelope.envelopeId;
    console.log("The ID we are changing is: ");
    console.log(filteredEnv);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        envelopes: filteredEnv,
      })
    };
    await fetch('/api/set-changed/', requestOptions);
    console.log("Changing to false");
  }

  toggleOpen() {
    // disable if game isn't running
    if (!this.props.isStarted) return;
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
  getEnvelope() {
    const svgStyle = { margin: "0 auto", maxWidth: "50px", minHeight: "60px" };
    if (!this.props.activeEnvelope) {
      return (
        <img
          className="invisible"
          style={svgStyle}
          src={envClosed}
          alt="Closed envelope"
          onClick={this.toggleOpen}
        />
      );
    }
    
    switch (this.props.activeEnvelope.clientState) {
      case 1:
        return (
          <img
            style={svgStyle}
            src={this.props.activeEnvelope.isChanged? envChanged : envClosed}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      case 2:
        return (
          <img
            style={svgStyle}
            src={this.props.activeEnvelope.isChanged? envChanged : envOpen}
            alt="Open envelope"
            onClick={this.toggleOpen}
          />
        );
      case 3:
        return (
          <img
            style={svgStyle}
            src={this.props.activeEnvelope.isChanged? envChanged : envOpenIdx}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      case 4:
        return (
          <img
            style={svgStyle}
            src={this.props.activeEnvelope.isChanged? envChanged : envOk}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      default:
        return <div></div>;
    }
  }

  render() {
    const open = this.state.open;
    return (
      <div style={this.props.isStarted ? { width: "70%", textAlign: "center" } : { width: "70%", textAlign: "center", opacity: "0.5" }}>
        {this.props.activeEnvelope ? `Stamp ${this.props.activeEnvelope.matchingStamp}` : "No envelope"}
        <br></br>
        {this.getEnvelope()}
        <Fade
          in={open}
        >
          <div id="collapse-stamp-bar">
            <ButtonGroup aria-label="collapse-stamp-bar" className={this.state.open ? "visible" : "invisible"}>
              {this.props.activeEnvelope ? this.props.activeEnvelope.random.map((i) => {
                const variant = i === this.props.activeEnvelope.matchingStamp ? "success" : "danger";
                return (
                  <Button
                    key={i}
                    variant={this.props.activeEnvelope.checked[i] ? variant : "primary"}
                    disabled={this.state.waiting || this.props.activeEnvelope.checked[i] || !this.props.isStarted}
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