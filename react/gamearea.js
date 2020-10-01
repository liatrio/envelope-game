import React, { Component } from 'react'
import Gameprogress from './gameprogress';
import ChairsCollection from './chair_collection';
import Controls from './controls';

import './index.css'
import moment from 'moment';
import EnvelopeStack from './envelope_stack'

class Gamearea extends Component {

  constructor(props) {
    super(props);
    this.intervalID = '';
    this.state = {
      isStarted: false,
      seats: [],
      team_id_1: '',
      team_id_2: '',
      team1Score: 0,
      team2Score: 0,
      seconds: 0,
      seatsFull: false,
      seatId: null,
      teamName_1: 'Unnamed Team 1',
      teamName_2: 'Unnamed Team 2',
      envelope: [],
      display_name: '',
      now: '',
      countdown: ''
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
    this.intervalID = setInterval(this.joinGame.bind(this), 2000);
  }

  async componentWillUnmount() {
    clearInterval(this.intervalID); 
  }

  async joinGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/join/${gameID}`)
    const json = await response.json();
    this.setState({ isStarted: json.is_started,
                    seats: json.seats,
                    team_id_1: json.team_1_id,
                    team_id_2: json.team_2_id,
                    teamName_1: json.teamName_1,
                    teamName_2: json.teamName_2
                    
                  });
    if (this.state.seats.every(s => s.is_taken === true)) {
      this.setState({ seatsFull: true });
      clearInterval(this.intervalID);
      this.intervalID = setInterval(this.updateGame.bind(this), 2000);
    }
  }

  async updateGame() {
    const gameID = this.props.match.params.gameID;
    console.log("72" + gameID);
    console.log("73" + this.props.match.params.gameID);
    const response = await fetch(`/api/game-state/${gameID}`)
    const json = await response.json();
    
    this.setState({envelope: json.envelopes, 
      team_id_1: json.team_1_id, 
      team_id_2: json.team_2_id, 
      display_name: json.display_name,
      isStarted: json.is_started,
      team1Score: json.score1,
      team2Score: json.score2
    });
    console.log("87" + this.state.team1Score);
  }

  render() {
    if (typeof (this.props.location.state) === 'undefined') {
      return (
        <div>
          Game Area
          <Gameprogress is_started={this.state.isStarted} t1Name={ this.state.teamName_1 } team1Score={this.state.team1Score} team2Score={this.state.team2Score} seatsFull={this.state.seatsFull} t2Name={ this.state.teamName_2 }/>
          <ChairsCollection seats={this.state.seats} gameID={this.props.match.params.gameID} setSeatId={(id) => this.setSeatId(id)} playerSeatId={this.state.seatId} />
        </div>
      );
    } else {
      return (
        <div>
          Game Area
          <EnvelopeStack></EnvelopeStack>
          <Gameprogress facilitatorGets={this.props.location.state.facilitatorID} gameID={this.props.match.params.gameID} is_started={this.state.isStarted} team1Score={this.state.team1Score} team2Score={this.state.team2Score} t1Name={ this.state.teamName_1 } seatsFull={this.state.seatsFull} t2Name={ this.state.teamName_2 } />
          <ChairsCollection seats={this.state.seats} gameID={this.props.match.params.gameID} setSeatId={(id) => this.setSeatId(id)} playerSeatId={this.state.seatId} />
          <Controls facilitatorGets={this.props.location.state.facilitatorID} team_id_1={this.state.team_id_1} team_id_2={this.state.team_id_2} seatsFull={this.state.seatsFull} gameID={this.props.match.params.gameID}/>
        </div>
      );
    }

  }
}

export default Gamearea
