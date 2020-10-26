import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import PlayerNameForm from './player_name';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      settingSeat: false,
      selectedSeat: null,
      seatSuccess: false,
      selectedSeatNumber: null,
    }
    this.selectSeat = this.selectSeat.bind(this);
    this.getSeats = this.getSeats.bind(this);
    this.chooseRandom = this.chooseRandom.bind(this);
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
      // seat selected successfully
      this.setState({ seatSuccess: true });
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
              disabled={s.isTaken || this.state.settingSeat || this.props.seatId}
              variant={this.state.seatSuccess && this.state.selectedSeat === s.seatId ? "success" : s.isTaken ? "secondary" : "primary"}
              onClick={() => this.selectSeat(s)}
            >
              {this.state.selectedSeat === s.seatId && !this.props.seatId ?
                <div>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </div> : s.displayName === null ?
                  `Player ${s.seatNumber + 1}` :
                  s.displayName
              }
            </Button>
            <br></br>
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
      <div>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <dt>Flow Seats</dt>
            <hr></hr>
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
          <dt>Batch Seats</dt>
          <hr></hr>
            <ul className="chairColumn list-unstyled">
              {this.getSeats(false)}
            </ul>
          </Col>
        </Row >
        <Row className="justify-content-md-center">
          <Button
            className={this.props.seats.length === 0 || this.props.seatsFull ? "invisible" : "visible"}
            disabled={this.state.settingSeat}
            variant={this.state.settingSeat ? "secondary" : "primary"}
            onClick={this.chooseRandom}
          >
            Choose a random seat
          </Button>
        </Row>
        <hr></hr>
        <PlayerNameForm
          toggleControls={this.props.toggleControls}
          seatId={this.props.seatId}
          seatSucees={this.state.seatSuccess}
        ></PlayerNameForm>
      </div>
    );
  }
}

export default Controls
