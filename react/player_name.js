import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

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
    this.setState({ waiting: true });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: this.state.displayName,
        seatId: this.props.seatId,
      })
    };
    const response = await fetch('/api/set-player-name', requestOptions);
    const json = await response.json();
    console.log(json);
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
            placeholder="Display Name"
            name="playerName"
            onChange={this.playerNameChange}
          />
        </Form.Group>
        <Button onClick={this.setPlayerName} disabled={this.state.waiting}>Submit</Button>
      </Col>
    );
  }
}

export default PlayerNameForm