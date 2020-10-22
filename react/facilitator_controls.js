import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import TeamNameForm from './team_name';

class FacilitatorControls extends Component {
  constructor(props) {
    super(props);
    this.getSeats = this.getSeats.bind(this);
    this.emptySeat = this.emptySeat.bind(this);
  }

  async emptySeat(seatId) {
    await fetch(`/api/remove-player/${seatId}`);
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
              className={s.isTaken ? "visible" : "invisible"}
              variant="danger"
              onClick={() => this.emptySeat(s.seatId)}
            >
              X
            </Button>
            {s.displayName === null ?
              `Player ${s.seatNumber + 1}` :
              s.displayName
            }
            <Button
              disabled={this.props.seatId === s.seatId}
            >
              Switch to {s.seatNumber + 1}
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
      <div>
        <Row className="justify-content-md-center">

          <Col>
            <TeamNameForm
              team1={this.props.team1}
              team2={this.props.team2}
              facilitatorId={this.props.facilitatorId}
              toggleControls={this.props.toggleControls}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          Remove a player <br />
        </Row>
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
        </Row >
      </div>
    );
  }
}

export default FacilitatorControls