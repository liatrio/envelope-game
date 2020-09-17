import React, { Component } from 'react'
import Gameprogress from './gameprogress';
import Chairs from './chairs';
import Controls from './controls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import './index.css'
import { withRouter } from 'react-router'

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
      teamName_1: 'Unnamed Team 1',
      teamName_2: 'Unnamed Team 2',
    }
  }

  async componentDidMount() {
    this.joinGame();
  }

  async joinGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/join/${gameID}`)
    const json = await response.json();
    this.setState({ isStarted: json.is_started, seats: json.seats, team_id_1: json.team_1_id, team_id_2: json.team_2_id, teamName_1: json.teamName_1, teamName_2: json.teamName_2 });
    this.intervalID = setTimeout(this.joinGame.bind(this), 500);

    if (this.state.seats.every(s => s.is_taken === true)) {
      clearTimeout(this.intervalID);
    }
  }

  async updateGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/game-state/${gameID}`)
    const json = await response.json();
    this.setState({ isStarted: json.is_started, seats: json.seats, team_id_1: json.team_1_id, team_id_2: json.team_2_id });
  }

  render() {
    return (
      <div>
        Game Area
        <Gameprogress t1Name={'Eager Carabou'} t1Begin={4} t1End={9} t2Name={'Gothic Toads'} t2Begin={1} t2End={2} />
        <Chairs seats={this.state.seats} gameID={this.props.match.params.gameID} />
        <Controls facilitatorGets={this.props.location.state.facilitatorID} team_id_1={this.state.team_id_1} team_id_2={this.state.team_id_2} />
      </div>
    );
  }
}

export default Gamearea
