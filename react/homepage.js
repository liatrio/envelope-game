import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Instructions from './instructions';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      gameId: null,
      facilitatorId: null,
      success: false,
    };
    this.createGame = this.createGame.bind(this);
  }

  async createGame() {
    if (this.state.disabled) {
      return;
    }
    this.setState({ disabled: true });
    const response = await fetch('/api/create')
    const json = await response.json();
    if (json.success) {
      this.setState({ gameId: json.game, facilitatorId: json.facilitator, success: true })
    }
  }
  render() {
    if (this.state.gameId && this.state.success) {
      return <Redirect to={{ state: { facilitatorId: this.state.facilitatorId }, pathname: "/gamearea/" + this.state.gameId }} />
    }
    return (
      <Instructions 
        createGame={this.createGame}
        homepage={true}
        disabled={this.state.disabled}
      />
    )
  }
}

export default Homepage;
