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
      team_id_1: '',
      team_id_2: '',
      seconds: 0,
      seatsFull: false,
      seatId: null,
      mySeatNumber: null,
      teamName_1: 'Unnamed Team 1',
      teamName_2: 'Unnamed Team 2',
      envelopes: [],
      display_name: '',
      now: '',
      countdown: '',
      start_time: null
    }
    this.setSeatId = this.setSeatId.bind(this);
  }

  setSeatId(id) {
    console.log(id);
    this.setState({ seatId: id });
  }
  async chooseSeat(index, seat_id) {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
    const json = await response.json();
  }

  async componentDidMount() {
    this.joinGame();
  }

  async joinGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/join/${gameID}`)
    const json = await response.json();
    this.setState({
      isStarted: json.is_started,
      seats: json.seats,
      team_id_1: json.team_1_id,
      team_id_2: json.team_2_id,
      teamName_1: json.teamName_1,
      teamName_2: json.teamName_2

    });
    this.intervalID = setTimeout(this.joinGame.bind(this), 2000);

    if (this.state.seats.every(s => s.is_taken === true)) {
      this.setState({ seatsFull: true });
      clearTimeout(this.intervalID);
      this.updateGame();
    }
  }

  async updateGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/game-state/${gameID}`)
    const json = await response.json();
    this.setState({
      envelopes: json.envelopes,
      team_id_1: json.team_1_id,
      team_id_2: json.team_2_id,
      display_name: json.display_name,
      start_time: json.start_time
    });
    this.intervalID = setTimeout(this.updateGame.bind(this), 1000);
  }

  render() {
    if (typeof (this.props.location.state) === 'undefined') {
      return (
        <div>
          Game Area
          <GameProgress
            start_time={this.state.start_time}
            t1Name={this.state.teamName_1}
            t1Begin={4} t1End={9}
            t2Name={this.state.teamName_2}
            t2Begin={1}
            t2End={2}
          />
          <ChairsCollection
            envelopes={this.state.envelopes}
            mySeatNumber={this.state.mySeatNumber}
            start_time={this.state.start_time}
            seats={this.state.seats.sort((a, b) => {
              return a.seat_number - b.seat_number
            })}
            gameID={this.props.match.params.gameID}
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
            start_time={this.state.start_time}
            t1Name={this.state.teamName_1}
            t1Begin={this.state.startTime}
            t1End={9} t2Name={this.state.teamName_2}
            t2Begin={this.state.startTime}
            t2End={2}
          />
          <ChairsCollection
            envelopes={this.state.envelopes}
            start_time={this.state.start_time}
            mySeatNumber={this.state.mySeatNumber}
            seats={this.state.seats}
            gameID={this.props.match.params.gameID}
            setSeatId={(id) => this.setSeatId(id)}
            playerSeatId={this.state.seatId}
          />
          <Controls
            facilitatorGets={this.props.location.state.facilitatorID}
            team_id_1={this.state.team_id_1}
            team_id_2={this.state.team_id_2}
            seatsFull={this.state.seatsFull}
            gameID={this.props.match.params.gameID}
          />
        </div>
      );
    }

  }
}

export default GameArea
