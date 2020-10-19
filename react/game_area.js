import React, { Component } from 'react'
import GameProgress from './game_progress';
import ChairsCollection from './chair_collection';
import Controls from './controls'
import background, { ReactComponent as Background } from './assets/background.svg';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

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
      team2Score: 0,
      showControls: false,
    }
    this.setSeatId = this.setSeatId.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
  }

  setSeatId(seat) {
    console.log(seat);
    this.setState({
      seatId: seat.seatId,
      mySeatNumber: seat.seatNumber,
    });
    console.log(this.state.seatId);
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
      team2: json.team2,
      team1Name: json.team1Name,
      team2Name: json.team2Name,

    });
    if (this.state.seats.every(s => s.isTaken === true && s.displayName !== null)) {
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
      gameTick: json.gameTick,

    });
  }

  toggleControls() {
    this.setState({ showControls: !this.state.showControls});
  }

  render() {
    const style = {
      backgroundImage: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "150%",
      backgroundPosition: "50% 50%",
      position: "relative",
      width: "100%",
      height: "100vh"
    };
    return (
      <div style={style}>
        <Row className="justify-content-md-center">
          <Button 
            onClick={this.toggleControls}
            disabled={this.state.seatId}
            variant={this.state.seatId ? "secondary" : "primary"}
            className={this.state.seatsFull ? "invisible" : "visible"}
          >
            Join Game
          </Button>
        </Row>
        <GameProgress
          facilitatorId={this.props.location.state ? this.props.location.state.facilitatorId : ''}
          gameID={this.props.match.params.gameId}
          gameTick={this.state.gameTick}
          team1Score={this.state.team1Score}
          team2Score={this.state.team2Score}
          envelopes={this.state.envelopes}
          startTime={this.state.startTime}
          t1Name={this.state.team1Name}
          t2Name={this.state.team2Name}
          isStarted={this.state.isStarted}
          seatsFull={this.state.seatsFull}
        />
        <ChairsCollection
          envelopes={this.state.envelopes}
          startTime={this.state.startTime}
          mySeatNumber={this.state.mySeatNumber}
          seats={this.state.seats}
          gameId={this.props.match.params.gameId}
          setSeatId={(num, isTeamOne) => this.setSeatId(num, isTeamOne)}
          playerSeatId={this.state.seatId}
        />
        <Controls
          facilitatorId={this.props.location.state ? this.props.location.state.facilitatorId : ''}
          playerSeatId={this.state.seatId}
          setSeatId={(num, isTeamOne) => this.setSeatId(num, isTeamOne)}
          seats={this.state.seats}
          team1={this.state.team1}
          team2={this.state.team2}
          seatsFull={this.state.seatsFull}
          gameId={this.props.match.params.gameId}
          show={this.state.showControls}
          toggleControls={this.toggleControls}
        />
      </div>
    );
  }
}

export default GameArea
