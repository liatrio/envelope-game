import React, { Component } from 'react'
import GameProgress from './game_progress';
import ChairsCollection from './chair_collection';
import Controls from './controls'

import './index.css'

class GameArea extends Component {

  constructor(props) {
    super(props);
    this.intervalId = '';
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
      startTime: null,
      gameTick: 0,
      team1Score: 0,
      team2Score: 0
    }
    this.setSeatId = this.setSeatId.bind(this);
  }

  setSeatId(id) {
    console.log(id);
    this.setState({ seatId: id });
  }

  componentDidMount() {
    this.intervalId = setInterval(this.joinGame.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }


  async joinGame() {
    const gameId = this.props.match.params.gameId;
    const response = await fetch(`/api/join/${gameId}`)
    const json = await response.json();
    this.setState({
      isStarted: json.isStarted,
      seats: json.seats,
      team1: json.team1,
      team2: json.team1,
      team1Name: json.team1Name,
      team2Name: json.team2Name
    });
    if (this.state.seats.every(s => s.isTaken === true)) {
      this.setState({ seatsFull: true });
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.updateGame.bind(this), 1000);
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
      isStarted: json.isStarted,
      team1Score: json.score1,
      team2Score: json.score2,
      gameTick: json.gameTick
    });
  }

  render() {
    if (typeof (this.props.location.state) === 'undefined') {
      return (
        <div>
          Game Area
          <GameProgress
            gameTick={this.state.gameTick}
            gameID={this.props.match.params.gameId}
            team1Score={this.state.team1Score}
            team2Score={this.state.team2Score}
            t1Name={this.state.team1Name}
            isStarted={this.state.isStarted}
            seatsFull={this.state.seatsFull}
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
            facilitatorId={this.props.location.state.facilitatorId}
            gameID={this.props.match.params.gameId}
            gameTick={this.state.gameTick}
            team1Score={this.state.team1Score}
            team2Score={this.state.team2Score}
            t1Name={this.state.team1Name}
            isStarted={this.state.isStarted}
            seatsFull={this.state.seatsFull}
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
