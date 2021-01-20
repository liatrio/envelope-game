import React, { Component } from 'react'

import envOpen from './assets/envelope_open.svg';
import envClosed from './assets/envelope_closed.svg';
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
    console.log(this.props.activeEnvelope);
    switch (this.props.activeEnvelope.clientState) {
      case 1:
        return (
          <img
            style={svgStyle}
            src={envClosed}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      case 2:
        return (
          <img
            style={svgStyle}
            src={envOpen}
            alt="Open envelope"
            onClick={this.toggleOpen}
          />
        );
      case 3:
        return (
          <img
            style={svgStyle}
            src={envOpenIdx}
            alt="Closed envelope"
            onClick={this.toggleOpen}
          />
        );
      case 4:
        return (
          <img
            style={svgStyle}
            src={envOk}
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