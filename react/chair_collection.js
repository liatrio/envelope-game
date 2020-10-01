import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Chair from './chair'
import './index.css'
class ChairsCollection extends Component {
  render() {
    let team1Chairs = []
    let team2Chairs = []
    this.props.seats.forEach((c, index) => {
      if (c.isTeam1) {
        team1Chairs.push(
          <li key={c.seatId}>
            <Chair
              envelopes={this.props.envelopes.filter((i) => {
                return i.team === c.teamId
              })}
              otherChairs={this.props.seats}
              setSeatId={(id) => this.props.setSeatId(id)}
              playerSeatId={this.props.playerSeatId}
              isTeam1={c.isTeam1}
              seatId={c.seatId}
              teamId={c.teamId}
              gameId={this.props.gameId}
              isTaken={c.isTaken}
              seatNumber={c.seatNumber}
            ></Chair>
          </li>
        );
      } else {
        team2Chairs.push(
          <li key={c.seatId}>
            <Chair
              envelopes={this.props.envelopes.filter((i) => {
                return i.team === c.teamId
              })}
              setSeatId={(id) => this.props.setSeatId(id)}
              playerSeatId={this.props.playerSeatId}
              isTeam1={c.isTeam1}
              seatId={c.seatId}
              teamId={c.teamId}
              gameId={this.props.gameId}
              isTaken={c.isTaken}
              seatNumber={c.seatNumber}
            ></Chair>
          </li>
        );
      }
    });
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div>
                <ul className="chairColumn list-unstyled">{team1Chairs}</ul>
              </div>
            </Col>
            <Col>
              <div>
                <ul className="chairColumn list-unstyled">{team2Chairs}</ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default ChairsCollection;