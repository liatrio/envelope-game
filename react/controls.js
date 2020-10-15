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
      activeIndex: 0,
      settingSeat: false,
      selectedSeat: null,
      seatSuccess: false,
      selectedSeatNumber: null,
    }

    // bind any handlers in the constructor
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamOneName = this.setTeamOneName.bind(this);
    this.setTeam2Name = this.setTeam2Name.bind(this);
    this.setTeamNames = this.setTeamNames.bind(this);
    this.selectSeat = this.selectSeat.bind(this);
    this.getSeats = this.getSeats.bind(this);
    this.chooseRandom = this.chooseRandom.bind(this);
    this.hideControls = this.hideControls.bind(this);
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
    await fetch('/api/set-team-name', requestOptions);
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

  async selectSeat(seat) {
    this.setState({
      settingSeat: true,
      selectedSeat: seat.seatId,
      selectedSeatNumber: seat.seatNumber
    });
    const request = `/api/choose-seat/${seat.teamId}/${seat.seatId}`;
    const response = await fetch(request);
    const json = await response.json();
    if (json.success) {
      console.log(this.state.selectedSeatNumber);
      this.props.setSeatId(this.state.selectedSeatNumber, seat.isTeam1);
      // seat selected successfully
      this.setState({ seatSuccess: true });
      await new Promise(r => setTimeout(r, 500));
      this.setState({ activeIndex: 1 });

    } else {
      this.setState({
        settingSeat: false,
        selectedSeat: null,
      });
    }
  }

  chooseRandom() {
    const randomSeat = this.props.seats.find(i => {
      return !i.isTaken;
    });
    this.selectSeat(randomSeat);
  }

  hideControls() {
    this.setState({ show: false });
  }

  getSeats(isTeamOne) {
    // if seat information has loaded
    if (this.props.seats.length !== 0) {
      // check if we should dismiss the modal
      return this.props.seats.filter(i => {
        return i.isTeam1 === isTeamOne;
      }).sort((a, b) => {
        return (a.seatNumber > b.seatNumber ? 1 : -1);
      }).map(s => {
        return (
          <li key={s.seatId}>
            <Button
              className={s.isTaken ? "chairFilled" : "chairNotFilled"}
              disabled={s.isTaken || this.state.settingSeat}
              variant={this.state.seatSuccess && this.state.selectedSeat === s.seatId ? "success" : s.isTaken ? "secondary" : "primary"}
              onClick={() => this.selectSeat(s)}
            >
              {this.state.selectedSeat === s.seatId ?
                <div>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </div> : `Player ${s.seatNumber + 1}`}
            </Button>
            <br></br>
          </li>
        );
      });
    } else {
      // return placeholder buttons to prevent "pop in"
      return [...Array(3).keys()].map(i => {
        return (
          <li key={i}>
            <Button
              disabled={true}
              className="invisible"
            >Player 0</Button>
          </li>
        );
      });
    }
  }

  render() {
    return (
      <Modal
        backdrop="static"
        show={this.props.seatsFull ? false : this.state.show}
        onHide={this.hideControls}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container fluid>
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

                {
                  this.props.facilitatorId &&
                  <TeamNameForm
                    facilitatorId={this.props.facilitatorId}
                    team1={this.props.team1}
                    team2={this.props.team2}
                  />
                }
                <Row className="justify-content-md-center">
                  <Col md="auto">
                    Team 1 Seats
                      <br></br>
                    <ul className="chairColumn list-unstyled">
                      {this.getSeats(true)}
                    </ul>
                  </Col>
                  <Col md="auto">
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="primary"
                      className={this.props.seats.length === 0 ? "visible" : "invisible"}
                    />
                  </Col>
                  <Col md="auto">
                    Team 2 Seats
                        <br></br>
                    <ul className="chairColumn list-unstyled">
                      {this.getSeats(false)}
                    </ul>
                  </Col>
                </Row>
                <Row className="justify-content-md-center">
                  <Button
                    className={this.props.seats.length === 0 || this.props.seatsFull ? "invisible" : "visible"}
                    disabled={this.state.settingSeat}
                    variant={this.state.settingSeat ? "secondary" : "primary"}
                    onClick={() => this.chooseRandom()}
                  >
                    Choose a random seat
                  </Button>
                </Row>
              </Carousel.Item>
              <Carousel.Item>
                <PlayerNameForm
                  hideControls={this.hideControls}
                  seatId={this.state.selectedSeat}
                ></PlayerNameForm>
              </Carousel.Item>
            </Carousel>
          </Modal.Body>
        </Container>
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
      displayName: '',
      waiting: false,
    };
    this.playerNameChange = this.playerNameChange.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);
  }

  playerNameChange(event) {
    this.setState({ displayName: event.target.value });
  }

  async setPlayerName() {
    this.setState({ waiting: true });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: this.state.displayName,
        seatId: this.props.seatId,
      })
    };
    const response = await fetch('/api/set-player-name', requestOptions);
    const json = await response.json();
    console.log(json);
    this.setState({ waiting: false });
    this.props.hideControls();
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
