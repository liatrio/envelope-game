import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'universal-cookie';

import background from './assets/background.svg';
import Controls from './controls'
import { ReactComponent as Table } from './assets/table.svg';
import EnvelopeArea from './envelope_area';
import FacilitatorControls from './facilitator_controls';
import GameProgress from './game_progress';
import PlayerNameForm from './player_name';

import './index.css'

class GameArea extends Component {

  constructor(props) {
    super(props);
    this.gameId = props.match.params.gameId;
    let isFacilitator = false;
    let facilitatorId = null;
    const cookies = new Cookies();
    const facil = cookies.get('facilitatorInfo');
    this.session = cookies.get('session');
    if (facil) {
      if (facil.game === this.gameId) {
        isFacilitator = true;
        facilitatorId = facil.id;
      }
    }
    this.state = {
      isStarted: false,
      seats: [],
      team1: '',
      team2: '',
      seconds: 0,
      seatsFull: false,
      seatId: null,
      mySeatNumber: null,
      playerSeatId: null,
      team1Name: '',
      team2Name: '',
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
      isFacilitator: isFacilitator,
      facilitatorId: facilitatorId,
      isTeam1: null,
    }
    this.intervalId = '';
    this.toggleJoinGame = this.toggleJoinGame.bind(this);
    this.togglePlayerName = this.togglePlayerName.bind(this);
    this.toggleFacilitatorControls = this.toggleFacilitatorControls.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(this.joinGame.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }


  async joinGame() {
    const response = await fetch(`/api/join/${this.gameId}`)
    const json = await response.json();
    this.setState({
      isStarted: json.isStarted,
      seats: json.seats,
      team1: json.team1,
      team2: json.team2,
      team1Name: json.team1Name,
      team2Name: json.team2Name,
    });
    // check if we have selected a seat
    const match = this.state.seats.find(s => {
      return s.sessionId === this.session
    });
    if (match) {
      this.setState({
        seatId: match.seatId,
        mySeatNumber: match.seatNumber,
        isTeam1: match.isTeam1,
      });
    } else {
      if (this.state.seatId) {
        this.setState({ seatId: null });
      }
    }

    if (this.state.seats.every(s => s.isTaken === true)) {
      this.setState({ seatsFull: true });
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.updateGame.bind(this), 1000);
    }
  }

  async updateGame() {
    const response = await fetch(`/api/game-state/${this.gameId}`)
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
            {this.state.seat ? "Set Display Name" : "Join Game"}
          </Button>

          {this.state.isFacilitator &&
            <Button
              onClick={this.toggleFacilitatorControls}
              variant="primary"
            >
              Facilitator Controls
          </Button>
          }
        </div>
        <GameProgress
          facilitatorId={this.state.isFacilitator ? this.state.facilitatorId : ''}
          gameId={this.gameId}
          gameTick={this.state.gameTick}
          team1Score={this.state.team1Score}
          team2Score={this.state.team2Score}
          envelopes={this.state.envelopes ? this.state.envelopes :  []}
          startTime={this.state.startTime}
          t1Name={this.state.team1Name}
          t2Name={this.state.team2Name}
          isStarted={this.state.isStarted}
          seatsFull={this.state.seatsFull}
          seats={this.state.seats ? this.state.seats : []}
        />
        <EnvelopeArea
          envelopes={this.state.envelopes ? this.state.envelopes.filter((i) => {
            return i.seatNumber === this.state.mySeatNumber && i.isTeam1 === this.state.isTeam1
          }) : []}
          isStarted={this.state.isStarted}
          teamId={this.state.teamId}
          gameId={this.gameId}
          seat={this.state.seats ? this.state.seats.find(i => {
            return i.seatId === this.state.seatId;
          }) : null}
          seatNumber={this.state.mySeatNumber}
        ></EnvelopeArea>
        <div style={{ top: "65%", width: "60%", left: "20%", zIndex: 0, position: "absolute" }}>
          <Table></Table>
        </div>
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
                playerSeat={this.state.playerSeat}
                seatId={this.state.seatId}
                seats={this.state.seats ? this.state.seats : []}
                seatsFull={this.state.seatsFull}
                gameId={this.gameId}
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
                seatId={this.state.seatId}
                toggleControls={this.togglePlayerName}
              />
            </Modal.Body>
          </Container>
        </Modal>
        {this.state.isFacilitator &&
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
                  isStarted={this.state.isStarted}
                  seats={this.state.seats ? this.state.seats : []}
                  team1={this.state.team1}
                  team2={this.state.team2}
                  facilitatorId={this.state.facilitatorId}
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
