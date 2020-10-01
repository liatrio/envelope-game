import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, far, fas } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

class EnvelopeStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialCount: 40
    }
    this.updateStack = this.updateStack.bind(this);
    this.getFinishedEnvelopes = this.getFinishedEnvelopes.bind(this);
    this.buttonVariant = this.buttonVariant.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  updateStack() {
    if (this.props.stack_type === 0) {
      this.props.setActiveEnvelope();
    } else {

      // advance the envelopes to the next seat
      this.props.advanceEnvelopeSeat(this.getFinishedEnvelopes());
    }
  }

  // filter the finished envelopes based on if they are in current 
  // queue of envelopes
  // returns array of envelope ids
  getFinishedEnvelopes() {
    return this.props.finished_envelopes.filter((e) => {
      return this.props.envelopes.some((i) => {
        return e === i.envelope_id
      });
    });
  }

  buttonVariant() {
    if (!this.props.envelopes) return "secondary";
    if (this.props.stack_type === 0 && this.props.envelopes.length > 0) {
      return "primary";
    }
    if (this.getFinishedEnvelopes.length > 4) {
      return "success";
    }
    return "secondary";
  }

  isDisabled() {
    if (!this.props.envelopes) return true;
    if (this.props.stack_type === 0 && this.props.envelopes.length > 0) {
      // disable until they pass envelopes on
      if (this.getFinishedEnvelopes().length === 5) {
        return true;
      }
      return false;
    } else if (this.props.stack_type === 1 && this.getFinishedEnvelopes().length > 4) {
      return false;
    }
    return true;
  }

  render() {
    let count;
    if (this.props.stack_type === 0 && this.props.envelopes) {
      count = this.props.envelopes.length - this.getFinishedEnvelopes().length;
      if (this.props.active_envelope !== null) {
        count--;
      }
    } else {
      count = 0;
    }
    return (
      <div>
        {this.props.stack_type === 0 ? "Envelopes ready" : "Finished"}
        <br></br>
        <Button
          variant={this.buttonVariant()}
          disabled={this.isDisabled()}
          onClick={this.updateStack}
        >
          <div>
            <FontAwesomeIcon
              icon={faEnvelope}
              size='5x'
            >
            </FontAwesomeIcon>
            <br></br>
            <Badge pill variant="light" className="align-middle">
              {this.props.stack_type === 0 ? count : this.getFinishedEnvelopes().length}
            </Badge>
          </div>
        </Button>
      </div>
    );
  }
}

export default EnvelopeStack