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
  }

  updateStack() {
    if (this.props.stack_type === 0) {
      this.props.setActiveEnvelope();
    } else {
      // placeholder
    }
  }

  render() {    
    let count;
    if (this.props.stack_type === 0) {
      count = this.props.count - this.props.finished_count;
      if (this.props.active_envelope !== null) {
        count--;
      }
    } else {
      count = this.props.finished_count;
    }
    return (
      <div>
        {this.props.stack_type === 0 ? "Envelopes ready" : "Finished"}
        <br></br>
        <Button
          active={this.props.count !== 0}
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
              {count}
            </Badge>
          </div>
        </Button>
      </div>
    );
  }
}

export default EnvelopeStack