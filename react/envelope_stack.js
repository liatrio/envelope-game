import React, { Component } from 'react'
import { ReactComponent as ToDoFull } from './assets/stack_to-do_full.svg';
import { ReactComponent as ToDoHalf } from './assets/stack_to-do_half.svg';
import { ReactComponent as ToDoOne } from './assets/stack_to-do_one.svg';
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
    if (this.props.stackType === 0) {
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
    return this.props.finishedEnvelopes.filter((e) => {
      return this.props.envelopes.some((i) => {
        return e === i.envelopeId
      });
    });
  }

  buttonVariant() {
    if (!this.props.envelopes) return "secondary";
    if (this.props.stackType === 0 && this.props.envelopes.length > 0) {
      return "primary";
    }
    if (this.getFinishedEnvelopes().length > 4) {
      return "success";
    }
    return "secondary";
  }

  isDisabled() {
    if (!this.props.envelopes) return true;
    if (!this.props.isStarted) return true;
    if (this.props.stackType === 0 && this.props.envelopes.length > 0) {
      // disable until they pass envelopes on
      if (this.getFinishedEnvelopes().length === 5) {
        return true;
      }
      return false;
    } else if (this.props.stackType === 1 && this.getFinishedEnvelopes().length > 4) {
      return false;
    }
    return true;
  }

  render() {
    let count;
    if (this.props.stackType === 0 && this.props.envelopes) {
      count = this.props.envelopes.length - this.getFinishedEnvelopes().length;
      if (this.props.activeEnvelope !== null) {
        count--;
      }
    } else {
      count = 0;
    }
    return (
      <div style={{ width: "15%", position: "relative" }}>
        {this.props.stackType === 0 ? "Ready Envelopes" : this.isDisabled() ? "Finished Envelopes" : "Pass Envelopes On"}
        <br></br>
        <Button
          variant={this.buttonVariant()}
          disabled={this.isDisabled()}
          onClick={this.updateStack}
          size="lg"
          style={{ display: "contents" }}
        >
          <div style={{ position: "absolute", width: "100%", bottom: "0" }}>
            {count > 10 &&
              <ToDoFull />
            }

            {count <= 10 && count > 1 &&
              <ToDoHalf />
            }

            {count === 1 &&
              <ToDoOne />
            }

            {this.props.stackType === 1 && this.getFinishedEnvelopes().length === 1 &&
              <ToDoOne />
            }

            {this.props.stackType === 1 && this.getFinishedEnvelopes().length > 1 &&
              <ToDoHalf />
            }
            <br></br>
            <Badge pill variant="light" className="align-middle">
              {this.props.stackType === 0 ? count : this.getFinishedEnvelopes().length}
            </Badge>
          </div>
        </Button>
      </div>
    );
  }
}

export default EnvelopeStack