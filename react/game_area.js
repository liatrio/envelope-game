import React, { Component } from 'react'
import GameProgress from './game_progress';
import ChairsCollection from './chair_collection';
import Controls from './controls'

import './index.css'

class GameArea extends Component {

  constructor(props) {
    super(props);
    this.intervalID = '';
    this.state = {
      isStarted: false,
      seats: [],
      team1: '',
      team2: '',
      seconds: 0,
      seatsFull: false,
      seatId: null,
      mySeatNumber: null,
      team1Name: 'Unnamed Team 1',
      team2Name: 'Unnamed Team 2',
      envelopes: [],
      displayName: '',
      now: '',
      countdown: '',
      startTime: null
    }
    this.setSeatId = this.setSeatId.bind(this);
  }

  setSeatId(id) {
    console.log(id);
    this.setState({ seatId: id });
  }

  async componentDidMount() {
    this.joinGame();
  }

  async joinGame() {
    const gameId = this.props.match.params.gameId;
    const response = await fetch(`/api/join/${gameId}`)
    const json = await response.json();
    this.setState({
      isStarted: json.is_started,
      seats: json.seats,
      team1: json.team1,
      team2: json.team2,
      team1Name: json.team1Name,
      team2Name: json.team2Name

    });
    this.intervalID = setTimeout(this.joinGame.bind(this), 2000);

    if (this.state.seats.every(s => s.is_taken === true)) {
      this.setState({ seatsFull: true });
      clearTimeout(this.intervalID);
      this.updateGame();
    }
  }

  async updateGame() {
    console.log("updateGame");
    const gameId = this.props.match.params.gameId;
    const response = await fetch(`/api/game-state/${gameId}`)
    const json = await response.json();
    this.setState({
      envelopes: json.envelopes,
      team1: json.team1,
      team2: json.team2,
      displayName: json.displayName,
      startTime: json.startTime
    });
    this.intervalID = setTimeout(this.updateGame.bind(this), 1000);
  }

  render() {
    if (typeof (this.props.location.state) === 'undefined') {
      return (
        <div>
          Game Area
          <GameProgress
            startTime={this.state.startTime}
            t1Name={this.state.team1Name}
            t1Begin={4} t1End={9}
            t2Name={this.state.team2Name}
            t2Begin={1}
            t2End={2}
          />
          <ChairsCollection
            envelopes={this.state.envelopes}
            mySeatNumber={this.state.mySeatNumber}
            startTime={this.state.startTime}
            seats={this.state.seats.sort((a, b) => {
              return a.seatNumber - b.seatNumber
            })}
            gameId={this.props.match.params.gameId}
            setSeatId={(id) => this.setSeatId(id)}
            playerSeatId={this.state.seatId}
          />
        </div>
      );
    } else {
      return (
        <div>
          Game Area
          <GameProgress
            startTime={this.state.startTime}
            team1Name={this.state.team1Name}
            t1Begin={this.state.startTime}
            t1End={9} 
            team2Name={this.state.team2Name}
            t2Begin={this.state.startTime}
            t2End={2}
          />
          <ChairsCollection
            envelopes={this.state.envelopes}
            startTime={this.state.startTime}
            mySeatNumber={this.state.mySeatNumber}
            seats={this.state.seats}
            gameId={this.props.match.params.gameId}
            setSeatId={(id) => this.setSeatId(id)}
            playerSeatId={this.state.seatId}
          />
          <Controls
            facilitatorId={this.props.location.state.facilitatorId}
            team1={this.state.team1}
            team2={this.state.team2}
            seatsFull={this.state.seatsFull}
            gameId={this.props.match.params.gameId}
          />
        </div>
      );
    }

  }
}

export default GameArea
