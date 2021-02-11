import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'universal-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import background from './assets/background.svg';
import Controls from './controls';
import Instructions from './instructions';
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
      showInstructions: false,
      isFacilitator: isFacilitator,
      facilitatorId: facilitatorId,
      isTeam1: null,
      team1Completed: 0,
      team2Completed: 0,
      finishedEnvelopes: new Set(),
      activeEnvelope: null,
    }
    this.joinIntervalId = null;
    this.gameIntervalId = null;
    this.toggleInstructions = this.toggleInstructions.bind(this);
    this.toggleJoinGame = this.toggleJoinGame.bind(this);
    this.finishActiveEnvelope = this.finishActiveEnvelope.bind(this);
    this.setActiveEnvelope = this.setActiveEnvelope.bind(this);
    this.updateActiveEnvelope = this.updateActiveEnvelope.bind(this);
    this.advanceEnvelopeSeat = this.advanceEnvelopeSeat.bind(this);
    this.togglePlayerName = this.togglePlayerName.bind(this);
    this.createStartEnvelope = this.createStartEnvelope.bind(this);
    this.toggleFacilitatorControls = this.toggleFacilitatorControls.bind(this);
    this.checkFinishedEnvelopes = this.checkFinishedEnvelopes.bind(this);
    this.createStartEnvelope = this.createStartEnvelope.bind(this);
    this.createFinishedEnvelope = this.createFinishedEnvelope.bind(this);
  }

  componentDidMount() {
    this.joinIntervalId = setInterval(this.joinGame.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.joinIntervalId);
    clearInterval(this.gameIntervalId);
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
      if (!this.gameIntervalId) {
        this.gameIntervalId = setInterval(this.updateGame.bind(this), 1000);
      }
    } else {
      this.setState({ seatsFull: false });
    }
  }

  async updateGame() {
    const response = await fetch(`/api/game-state/${this.gameId}`)
    const json = await response.json();
    json.envelopes.sort((a, b) => (a.groupNumber > b.groupNumber) ? 1 : -1);
    this.setState({
      envelopes: json.envelopes,
      team1: json.team1,
      team2: json.team2,
      displayName: json.displayName,
      isStarted: json.isStarted,
      team1Score: json.score1,
      team2Score: json.score2,
      gameTick: json.gameTick,
      team1Completed: json.team1Completed,
      team2Completed: json.team2Completed
    });
    this.checkFinishedEnvelopes();
  }

  checkFinishedEnvelopes(){
    let finishedTemp = this.state.finishedEnvelopes;
    let prevCompleted = this.state.envelopes.filter(item => item.prevCompleted === true)
    
    for (let i = 0; i < prevCompleted.length; i++) {
        if (this.state.finishedEnvelopes.has(prevCompleted[i].envelopeId) && prevCompleted[i].seatNumber === 3) {
          finishedTemp.delete(prevCompleted[i].envelopeId);
          
        }
      this.setState({finishedEnvelopes: finishedTemp});
    }
  }

  async finishActiveEnvelope() {
    let seat = this.state.seats ? this.state.seats.find(i => {
      return i.seatId === this.state.seatId;
    }) : null;
    let finished = this.state.finishedEnvelopes;
    finished.add(this.state.activeEnvelope.envelopeId);
    if (seat.isTeam1) {
      this.advanceEnvelopeSeat([this.state.activeEnvelope.envelopeId]);
    } else {
      let envelope = this.state.activeEnvelope;
      envelope.clientState = 5;
      await this.updateActiveEnvelope(envelope);
    }
    this.setState({ activeEnvelope: null, finishedEnvelopes: finished });
  }

  setActiveEnvelope() {
    let envelopes=this.state.envelopes ? this.state.envelopes.filter((i) => {
      return i.seatNumber === this.state.mySeatNumber && i.isTeam1 === this.state.isTeam1
    }) : [];
    if (envelopes && this.state.activeEnvelope === null && envelopes.length > 0) {
      // find an envelope that is not the active envelope and is not in the finished envelope set
      let unfinishedEnvelopes = envelopes.filter((e) => {
        return !this.state.finishedEnvelopes.has(e.envelopeId);
      });
      
      if (unfinishedEnvelopes.length > 0) {
        if (unfinishedEnvelopes[0].prevCompleted && !unfinishedEnvelopes[0].isChanged) {
          this.createFinishedEnvelope(unfinishedEnvelopes);
        }
        else {
          this.createStartEnvelope(unfinishedEnvelopes);
        }
      }
    }
  }

  createStartEnvelope(unfinishedEnvelopes){
    unfinishedEnvelopes[0].complete = false;
    unfinishedEnvelopes[0].stamped = false;
    unfinishedEnvelopes[0].envelopeState = 1;
    unfinishedEnvelopes[0].random = Array.from(Array(5), (x, i) => i + unfinishedEnvelopes[0].matchingStamp).sort(() => Math.random() - 0.5);
    unfinishedEnvelopes[0].checked = Array(5).fill(false, 0, 5);
    unfinishedEnvelopes[0].clientState = 1;
    this.setState({activeEnvelope: unfinishedEnvelopes[0]});

    this.updateActiveEnvelope(unfinishedEnvelopes[0]);
  }

  createFinishedEnvelope(unfinishedEnvelopes){
    unfinishedEnvelopes[0].complete = true;
    unfinishedEnvelopes[0].stamped = true;
    unfinishedEnvelopes[0].envelopeState = 4;
    unfinishedEnvelopes[0].random = Array.from(Array(5), (x, i) => i + unfinishedEnvelopes[0].matchingStamp).sort(() => Math.random() - 0.5);
    unfinishedEnvelopes[0].checked = Array(5).fill(true, 0, 5);
    unfinishedEnvelopes[0].clientState = 4;
    this.setState({activeEnvelope: unfinishedEnvelopes[0]});

    this.updateActiveEnvelope(unfinishedEnvelopes[0]);
  }
  // updates the active envelope's states
  // 0 is on todo stack
  // 1 is closed, active envelope
  // 2 is open active envelope
  // 3 stamped open envelope
  // 4 is stamped closed envelope
  // 5 is completed for that person
  async updateActiveEnvelope(envelope) {
    this.setState({ activeEnvelope: envelope });
    const request = `/api/update-envelope/${this.gameId}/${envelope.envelopeId}/${envelope.clientState}`;
    fetch(request);
  }

  advanceEnvelopeSeat(envelopes) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        envelopes: envelopes,
        gameId: this.gameId,
        teamId: this.state.envelopes.teamId,
        nextSeat: this.state.mySeatNumber + 1,
      })
    };
    fetch('/api/move-envelope', requestOptions);
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

  toggleInstructions() {
    this.setState({ showInstructions: !this.state.showInstructions });
  }

  render() {
    const style = {
      backgroundImage: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
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
          >
            {this.state.seatId ? "Set Display Name" : "Join Game"}
          </Button>

          {this.state.isFacilitator &&
            <Button
              onClick={this.toggleFacilitatorControls}
              variant="primary"
            >
              Facilitator Controls
          </Button>
          }
          <Button
            onClick={this.toggleInstructions}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
            />
            Instructions
          </Button>
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
          team1Completed={this.state.team1Completed}
          team2Completed={this.state.team2Completed}
          seats={this.state.seats ? this.state.seats : []}
        />
        <EnvelopeArea
          envelopes={this.state.envelopes ? this.state.envelopes.filter((i) => {
            return i.seatNumber === this.state.mySeatNumber && i.isTeam1 === this.state.isTeam1
          }) : []}
          isStarted={this.state.isStarted}
          teamId={this.state.teamId}
          gameId={this.gameId}
          finishedEnvelopes={this.state.finishedEnvelopes}
          activeEnvelope={this.state.activeEnvelope}
          finishActiveEnvelope={this.finishActiveEnvelope}
          setActiveEnvelope={this.setActiveEnvelope}
          updateActiveEnvelope={this.updateActiveEnvelope}
          advanceEnvelopeSeat={this.advanceEnvelopeSeat}
          seat={this.state.seats ? this.state.seats.find(i => {
            return i.seatId === this.state.seatId;
          }) : null}
          seatNumber={this.state.mySeatNumber}
        ></EnvelopeArea>
        <div style={{ top: "70%", width: "60%", left: "20%", zIndex: 0, position: "absolute" }}>
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
                  envelopes={this.state.envelopes ? this.state.envelopes :  []}
                  isStarted={this.state.isStarted}
                  seats={this.state.seats ? this.state.seats : []}
                  team1={this.state.team1}
                  team2={this.state.team2}
                  facilitatorId={this.state.facilitatorId}
                  toggleControls={this.toggleFacilitatorControls}
                  checkFinishedEnvelopes={this.checkFinishedEnvelopes}
                />
              </Modal.Body>
            </Container>
          </Modal>
        }
        <Modal
          dialogClassName="modal-70w"
          show={this.state.showInstructions}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          onHide={this.toggleInstructions}
        >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                The Envelope Game
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Instructions 
                homepage={false}
              />
            </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default GameArea
