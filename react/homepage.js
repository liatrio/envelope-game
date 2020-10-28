import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

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
      <div class="container-fluid">
	      <div class="row">
	      	<div class="col-md-12">
            <br></br>
            <h1 data-testid='123'>The Envelope Game</h1>
            <hr></hr>
			      <div class="jumbotron">
              <h4 text-align="left">About The Game</h4>
              <dt>The Envelope Game is a simple demonstration that shows the benefits of continuous flow delivery over a traditional large-batch delivery</dt>
              <li>Six players are divided into two Teams (Flow & Batch)</li>
              <li>One player from each Team is assigned to one of the following roles: Product/Planning, Development, or Quality Assurance.</li>
              <li>Both teams will be given the task of using teamwork to move along the envelopes through the team into delivery of the envelopes to the customer</li>
              <li>Each person on the batch team will be designated to work with ten envelopes at a time before handing off to the next partner in their team</li>
              <li>The Flow Team will have the luxury of passing on the envelopes to their team-mates right after finishing work on one envelope</li>
            </div>
            <div class="jumbotron">
              <h4 text-align="left">How to Play?</h4>
              <li>When loading up the game, there will be designated seats for each team to join the Game</li>
              <li>The Facilatator may have decided your team, if so, then select a seat on the corresponding batch/flow team given</li>
              <li>Once the table is filled with people in their seats, the Facilatator will be able to start the Game</li>
              <li>There are three roles per team: Product Owner, Development, and Testing, you will be assigned that role based on the seat chosen</li>
              <li>When the game starts, the Product Owner will be first to go and they will stamp the envelope with a number corresponding to the envelope and then they pass it to the Development</li>
              <li>Development will take the envelope, open it, and stamp on the index card the number that they see on the envelope and then they pass the envelope off to the Testing partner</li>
              <li>Testing will open the envelope, take the index card and adds a post-it note onto the index card that matches the number on the envelope and then they submit it to production</li>
            </div>
            <button class="btn btn-secondary btn-large" onClick={this.createGame} disabled={this.state.disabled}>
              {this.state.disabled ? 'Creating Game...' : 'Create a Game'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Homepage;
