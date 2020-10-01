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
      isStarted: json.is_started });
  }

  render() {
    if (typeof (this.props.location.state) === 'undefined') {
      return (
        <div>
          Game Area
          <Gameprogress is_started={this.state.isStarted} t1Name={ this.state.teamName_1 } t1Begin={4} t1End={9} seatsFull={this.state.seatsFull} t2Name={ this.state.teamName_2 } t2Begin={1} t2End={2} />
          <ChairsCollection seats={this.state.seats} gameID={this.props.match.params.gameID} setSeatId={(id) => this.setSeatId(id)} playerSeatId={this.state.seatId} />
        </div>
      );
    } else {
      return (
        <div>
          Game Area
          <EnvelopeStack></EnvelopeStack>
          <Gameprogress facilitatorGets={this.props.location.state.facilitatorID} gameID={this.props.match.params.gameID} is_started={this.state.isStarted} t1Name={ this.state.teamName_1 } t1Begin={this.state.startTime} t1End={9} seatsFull={this.state.seatsFull} t2Name={ this.state.teamName_2 } t2Begin={this.state.startTime} t2End={2} />
          <ChairsCollection seats={this.state.seats} gameID={this.props.match.params.gameID} setSeatId={(id) => this.setSeatId(id)} playerSeatId={this.state.seatId} />
          <Controls facilitatorGets={this.props.location.state.facilitatorID} team_id_1={this.state.team_id_1} team_id_2={this.state.team_id_2} seatsFull={this.state.seatsFull} gameID={this.props.match.params.gameID}/>
        </div>
      );
    }

  }
}

export default Gamearea
