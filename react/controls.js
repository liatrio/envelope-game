import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';

import IndexCard from './assets/index-card.svg'
import { Card } from 'react-bootstrap';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      show: true,
      showModal: true,
      activeIndex: 0,
      settingSeat: false,
      selectedSeat: null,
    }

    // bind any handlers in the constructor
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamOneName = this.setTeamOneName.bind(this);
    this.setTeam2Name = this.setTeam2Name.bind(this);
    this.setTeamNames = this.setTeamNames.bind(this);
    this.selectSeat = this.selectSeat.bind(this);
    this.isSeatTaken = this.isSeatTaken.bind(this);
  }
  async setTeamNames() {
    await this.setTeamOneName();
    await this.setTeam2Name();
  }

  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ team2Name: event.target.value });
  }

  async setTeamOneName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();
    console.log(requestOptions);
    console.log(json);
  }

  async setTeam2Name() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.team2Name,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }

  async selectSeat(seatNumber, isTeamOne) {
    this.setState({
      settingSeat: true,
      selectedSeat: seatNumber,
    });
    const request = `/api/choose-seat/${this.props.gameId}/${isTeamOne ? this.props.team1 : this.props.team2}/${seatNumber}`;
    console.log(request);
    const response = await fetch(request);
    const json = await response.json();
    if (json.success) {
      this.setState({ activeIndex: 1 });
    } else {
      console.log('bad');
      this.setState({
        settingSeat: false,
        selectedSeat: null,
      });
    }
  }

  isSeatTaken(seatNumber, isTeamOne) {
    const seat = this.props.seats.find(i => {
      return i.isTeam1 === isTeamOne && i.seatNumber === seatNumber;
    });
    if (seat && seat.isTeam1 && seat.seatNumber === 0) {
      console.log(seat);
    }
    return seat ? seat.isTaken : false;
  }

  render() {
    return (

      <Modal
        backdrop="static"
        show={this.props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.state.modalStatus === 0 ? 'Choose a seat' : 'Enter display name'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            indicators={false}
            controls={false}
            activeIndex={this.state.activeIndex}
          >
            <Carousel.Item>
              <Container fluid>
                {
                  this.props.facilitatorId &&
                  <TeamNameForm
                    facilitatorId={this.props.facilitatorId}
                    team1={this.props.team1}
                    team2={this.props.team2}
                  />
                }
                <Row>
                  <Col lg={false}>
                    Team 1 Seats
                      <br></br>
                    <ul className="chairColumn list-unstyled">
                      {
                        this.props.seats.filter(i => {
                          return i.isTeam1;
                        }).sort((a, b) => {
                          return (a.seatNumber > b.seatNumber ? 1 : -1);
                        }).map(s => {
                          return (
                            <li key={s.seatId}>
                              <Button
                                className={this.isSeatTaken(s.seatNumber, true) ? "chairFilled" : "chairNotFilled"}
                                disabled={this.isSeatTaken(s.seatNumber, true) || this.state.settingSeat}
                                variant={this.isSeatTaken(s.seatNumber, true) ? "secondary" : "primary"}
                                onClick={() => this.selectSeat(s.seatNumber, true)}
                              >
                                {this.state.selectedSeat === s.seatNumber ?
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  /> : `Player ${s.seatNumber + 1}`}
                              </Button>
                              <br></br>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </Col>
                  <Col lg={false}>
                    Team 2 Seats
                        <br></br>
                    <ul className="chairColumn list-unstyled">
                      {
                        this.props.seats.filter(i => {
                          return !i.isTeam1;
                        }).sort((a, b) => {
                          return (a.seatNumber > b.seatNumber ? 1 : -1);
                        }).map(s => {
                          return (
                            <li key={s.seatId}>
                              <Button
                                className={this.isSeatTaken(s.seatNumber, false) ? "chairFilled" : "chairNotFilled"}
                                disabled={this.isSeatTaken(s.seatNumber, false) || this.state.settingSeat}
                                variant={this.isSeatTaken(s.seatNumber, false) ? "secondary" : "primary"}
                                onClick={() => this.selectSeat(s.seatNumber, false)}
                              >
                                {this.state.selectedSeat === s.seatNumber + 3 ?
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  /> : `Player ${s.seatNumber + 1}`}
                              </Button>
                              <br></br>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </Col>
                </Row>
              </Container>
            </Carousel.Item>
            <Carousel.Item>
              <PlayerNameForm
                toggleControls={this.props.toggleControls}
              ></PlayerNameForm>
            </Carousel.Item>
          </Carousel>
        </Modal.Body>
      </Modal>

    );
  }
}

class TeamNameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOneName: '',
      teamTwoName: '',
      waiting: false,
    };
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamNames = this.setTeamNames.bind(this);
  }


  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ team2Name: event.target.value });
  }

  async setTeamNames() {
    this.setState({ waiting: true });
    const teamOneRequest = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', teamOneRequest);

    const teamTwoRequest = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.team2Name,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', teamTwoRequest);
    this.setState({ waiting: false });
    return false;
  }

  render() {
    return (
      <Row className="justify-content-md-center">
        <Form>
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Team One Name"
                name="team1"
                onChange={this.teamOneChange}
              >
              </Form.Control>
              <Form.Control
                type="text"
                placeholder="Team Two Name"
                name="team2"
                onChange={this.teamTwoChange}
              >
              </Form.Control>
              <Row className="justify-content-md-center">
                <Button onClick={this.setTeamNames} disabled={this.state.waiting}>Update Team Names</Button>
              </Row>
            </Form.Group>
          </Col>
        </Form>
      </Row>
    );
  }
}

class PlayerNameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      waiting: false,
    };
    this.playerNameChange = this.playerNameChange.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);

  }

  playerNameChange(event) {
    this.setState({ playerName: event.target.value });
  }

  async setPlayerName() {
    this.setState({ waiting: true });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: this.state.displayName,
        seatId: this.state.seatId,
      })
    };
    await fetch('/api/set-player-name', requestOptions);
    this.setState({ waiting: false });
    this.props.toggleControls();
  }

  render() {
    return (
      <Col>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Display Name"
            name="playerName"
            onChange={this.playerNameChange}
          />
        </Form.Group>
        <Button onClick={this.setPlayerName} disabled={this.state.waiting}>Submit</Button>
      </Col>
    );
  }
}

export default Controls
