import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import Envelope from './envelope'

class Gamearea extends Component {

  constructor(props) {
    super(props);
    this.intervalID = '';
    this.state = {
      isStarted: false,
      seats: [],
      seconds: 0,
      seatsFull: false,
    }
  }
  async chooseSeat(index, seat_id) {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
    const json = await response.json();
    if (json.success) {
      this.setState({ seat_id: seat_id });
    }
  }

  async componentDidMount() {
    this.joinGame();
  }

  async joinGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/join/${gameID}`)
    const json = await response.json();
    this.setState({ isStarted: json.is_started, seats: json.seats });
    this.intervalID = setTimeout(this.joinGame.bind(this), 2000);
  }

  async updateGame() {
    const gameID = this.props.match.params.gameID;
    const response = await fetch(`/api/updatestate/${gameID}`)
    const json = await response.json();
    this.setState({ isStarted: json.is_started, seats: json.seats });

  }

  render() {
    let team1Chairs = []
    let team2Chairs = []
    let chairs = this.state.seats;
    chairs.forEach((c, index) => {
      if (c.is_team_1) {
        team1Chairs.push(<li><button disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id)}>
          <FontAwesomeIcon icon={faChair} size='7x' color={c.is_taken ? 'blue' : 'black'} /><br />
        </button></li>);
      }
      else {
        team2Chairs.push(<li><button disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id)}>
          <FontAwesomeIcon icon={faChair} size='7x' color={c.is_taken ? 'blue' : 'black'} /><br />
        </button></li>);
      }
    });
    return (
      <div>
        Game Area<br />
        <br></br>
        <ul>{team1Chairs}
        </ul>
        <ul>
          {team2Chairs}
        </ul>
      </div>
    )
  }
}

export default Gamearea
