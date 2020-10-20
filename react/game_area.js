import React, { Component } from 'react'
import GameProgress from './game_progress';
import Controls from './controls'
import background, { ReactComponent as Background } from './assets/background.svg';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

import EnvelopeArea from './envelope_area';
import PlayerNameForm from './player_name';
import FacilitatorControls from './facilitator_controls';



import './index.css'

class GameArea extends Component {

  constructor(props) {
    super(props);
    this.gameID = props.match.params.gameId; 
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
      joinGameControls: false,
      facilitatorControls: false,
      playerNameControls: false,
    }
    this.setSeatId = this.setSeatId.bind(this);
    this.toggleJoinGame = this.toggleJoinGame.bind(this);
    this.togglePlayerName = this.togglePlayerName.bind(this);
    this.toggleFacilitatorControls = this.toggleFacilitatorControls.bind(this);

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

  toggleJoinGame() {
    this.setState({ joinGameControls: !this.state.joinGameControls });
  }

  togglePlayerName() {
    this.setState({ playerNameControls: !this.state.playerNameControls });
  }

  toggleFacilitatorControls() {
    this.setState({ facilitatorControls: !this.state.facilitatorControls });
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
        <div className="justify-content-md-center">
          <Button
            onClick={this.state.seatId ? this.togglePlayerName : this.toggleJoinGame}
            className={this.state.seatsFull && !this.state.playerSeatId ? "invisible" : "visible"}
          >
            {this.state.seatId ? "Set Display Name" : "Join Game"}
          </Button>

          {this.props.location.state && this.props.location.state.facilitatorId &&
            <Button
              onClick={this.toggleFacilitatorControls}
              variant="primary"
            >
              Facilitator Controls
          </Button>
          }
        </div>
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
          seats={this.state.seats}
        />
        <EnvelopeArea
          envelopes={this.state.envelopes.filter((i) => {
            return i.seatNumber === this.props.seatNumber
          })}
          teamId={this.state.teamId}
          gameId={this.gameId}
          seat={this.state.seats.find(i => {
            return i.seatId === this.state.seatId;
            })}
          seatNumber={this.props.mySeatNumber}
        ></EnvelopeArea>     
        <Modal
          show={this.state.joinGameControls}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered={true}
          onHide={this.toggleJoinGame}
        >
          <Container fluid>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Choose an open position
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Controls
                facilitatorId={this.props.location.state ? this.props.location.state.facilitatorId : ''}
                playerSeatId={this.state.seatId}
                setSeatId={(seat) => this.setSeatId(seat)}
                seats={this.state.seats}
                seatsFull={this.state.seatsFull}
                gameId={this.props.match.params.gameId}
                show={this.state.joinGameControls}
                toggleControls={this.toggleJoinGame}
              />
            </Modal.Body>
          </Container>
        </Modal>

        <Modal
          show={this.state.playerNameControls}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          onHide={this.togglePlayerName}
        >
          <Container fluid>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Set Display Name
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PlayerNameForm
                seatSuccess={true}
                seatId={this.state.playerSeatId}
                toggleControls={this.togglePlayerName}
              />
            </Modal.Body>
          </Container>
        </Modal>
        {this.props.location.state && this.props.location.state.facilitatorId &&
          <Modal
            show={this.state.facilitatorControls}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={this.toggleFacilitatorControls}
          >
            <Container fluid>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Facilitator Controls
              </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FacilitatorControls
                  seats={this.state.seats}
                  team1={this.state.team1}
                  team2={this.state.team2}
                  facilitatorId={this.props.location.state.facilitatorId}
                  toggleControls={this.toggleFacilitatorControls}
                />
              </Modal.Body>
            </Container>
          </Modal>
        }
      </div>
    );
  }
}

export default GameArea
