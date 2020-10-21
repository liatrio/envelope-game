import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class PlayerNameForm extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      displayName: '',
      waiting: false,
    };
    this.playerNameChange = this.playerNameChange.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);
  }

  playerNameChange(event) {
    this.setState({ displayName: event.target.value });
  }

  async setPlayerName() {
    if (this.props.seatId) {
      console.log("choose seat first");
      return;
    }
    this.setState({ waiting: true });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: this.state.displayName,
        seatId: this.props.seat.seatId,
      })
    };
    const response = await fetch('/api/set-player-name', requestOptions);
    await response.json();
    this.setState({ waiting: false });
    this.props.toggleControls();
  }

  render() {
    return (
      <Col>
        <Form.Group>
          <Form.Control
            ref={this.ref}
            type="text"
            placeholder="Enter display name"
            name="playerName"
            onChange={this.playerNameChange}
          />
        </Form.Group>
        <Button 
          onClick={this.setPlayerName} 
          disabled={this.state.waiting || this.props.seatId}
        >
          Submit
        </Button>
      </Col>
    );
  }
}

export default PlayerNameForm