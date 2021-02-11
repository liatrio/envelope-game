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
    this.stampEnvelope = this.stampEnvelope.bind(this);
    
  }

  checkStamp(num) {
    const {activeEnvelope, updateActiveEnvelope} = this.props;
    const thirdSeat = 2;
    if (activeEnvelope.prevCompleted && activeEnvelope.isChanged && activeEnvelope.seatNumber === thirdSeat) {
      this.fixBug(activeEnvelope);
      activeEnvelope.isChanged = false;
    }
    activeEnvelope.checked[num] = true;
    updateActiveEnvelope(activeEnvelope);
    this.setState({ waiting: true });
    setTimeout(() => {
      this.stampEnvelope(num, activeEnvelope);
    }, 500);
  }

  async fixBug(envelope) {
    let filteredEnv = envelope.envelopeId;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        envelopes: filteredEnv,
      })
    };
    await fetch('/api/set-changed/', requestOptions);
  }

  stampEnvelope(num, activeEnvelope){
    const {updateActiveEnvelope} = this.props;
    if (num === activeEnvelope.matchingStamp) {
      activeEnvelope.clientState = 3;
      activeEnvelope.stamped = true;
      this.setState({ waiting: false });
      updateActiveEnvelope(activeEnvelope);
    } else {
      this.setState({ waiting: false });
    }
  }

  toggleOpen() {
    const {activeEnvelope, updateActiveEnvelope, isStarted} = this.props;    
    // disable if game isn't running
    if (!isStarted) return;
    const open = this.state.open;
    if (open && activeEnvelope.stamped) {
      activeEnvelope.clientState = 4;
      updateActiveEnvelope(activeEnvelope);
      this.setState({ open: !open });
    } else if (!open && !activeEnvelope.stamped) {
      activeEnvelope.clientState = 2;
      updateActiveEnvelope(activeEnvelope);
      this.setState({ open: !open });
    }
  }

  // helper function to return the right icon based on state
  getEnvelope() {
    const {activeEnvelope} = this.props;
    const svgStyle = { margin: "0 auto", maxWidth: "50px", minHeight: "60px" };
    if (!activeEnvelope) {
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
    // envelope states
    // 0 is on todo stack
    // 1 is closed, active envelope
    // 2 is open active envelope
    // 3 stamped open envelope
    // 4 is stamped closed envelope
    // 5 is completed for that person
    switch (activeEnvelope.clientState) {
      case 1:
        return (
          <img
            style={svgStyle}
            src={activeEnvelope.isChanged? envChanged : envClosed}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      case 2:
        return (
          <img
            style={svgStyle}
            src={activeEnvelope.isChanged? envChanged : envOpen}
            alt="Open envelope"
            onClick={this.toggleOpen}
          />
        );
      case 3:
        return (
          <img
            style={svgStyle}
            src={activeEnvelope.isChanged? envChanged : envOpenIdx}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      case 4:
        return (
          <img
            style={svgStyle}
            src={activeEnvelope.isChanged? envChanged : envOk}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      default:
        return <div></div>;
    }
  }

  render() {
    const {isTeam1, finishActiveEnvelope, activeEnvelope, isStarted} = this.props;
    return (
      <div style={this.props.isStarted ? { width: "70%", textAlign: "center" } : { width: "70%", textAlign: "center", opacity: "0.5" }}>
        {activeEnvelope ? `Stamp ${activeEnvelope.matchingStamp}` : "No envelope"}
        <br></br>
        {this.getEnvelope()}
        <Fade 
          in={this.state.open}
        >
          <div id="collapse-stamp-bar">
            <ButtonGroup aria-label="collapse-stamp-bar" className={this.state.open ? "visible" : "invisible"}>
              {activeEnvelope ? activeEnvelope.random.map((i) => {
                const variant = i === activeEnvelope.matchingStamp ? "success" : "danger";
                return (
                  <Button
                    key={i}
                    variant={activeEnvelope.checked[i] ? variant : "primary"}
                    disabled={this.state.waiting || activeEnvelope.checked[i] || !isStarted}
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
          variant={activeEnvelope && activeEnvelope.stamped && !this.state.open ? "primary" : "secondary"}
          disabled={!(activeEnvelope && activeEnvelope.stamped && !this.state.open)}
          onClick={() => finishActiveEnvelope()}
        >
          {
            isTeam1 ?
              "Send to next person" :
              "Finish envelope"
          }
        </Button>
      </div>
    );
  }
}

export default Envelope