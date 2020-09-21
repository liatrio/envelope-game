import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Chair from './chair'
import Team from './team'
import './index.css'
class ChairsCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatID: '',
    }
  }
  async chooseSeat(index, seat_id, gameID) {
    if (!this.props.seatId) {
      const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
      const json = await response.json();
      console.log(json);
      console.log(this.state.seatID);
      if (json.success) {
        console.log(json.seat_id);
        this.props.setSeatId(json.seat_id);
      }
    }
  }

  render() {
    let team1Chairs = []
    let team2Chairs = []
    this.props.seats.forEach((c, index) => {
      if (c.is_team_1) {
        team1Chairs.push(
          <Chair
            otherChairs={this.props.seats}
            setSeatId={(id) => this.props.setSeatId(id)}
            playerSeatId={this.props.playerSeatId}
            is_team_1={c.is_team_1}
            seat_id={c.seat_id}
            team_id={c.team_id}
            game_id={this.props.gameID}
            is_taken={c.is_taken}
            seat_number={c.seat_number}
            display_name={c.display_name}
          ></Chair>
        );
      }
      else {
        team2Chairs.push(
          <Chair
            setSeatId={(id) => this.props.setSeatId(id)}
            playerSeatId={this.props.playerSeatId}
            is_team_1={c.is_team_1}
            seat_id={c.seat_id}
            team_id={c.team_id}
            game_id={this.props.gameID}
            is_taken={c.is_taken}
            seat_number={c.seat_number}
            display_name={c.display_name}
          ></Chair>
        );
      }
    });
    return (
      <div>
        <Container>
          <Row>
            <Team chairs={team1Chairs}></Team>
            <Team chairs={team2Chairs}></Team>
          </Row>
        </Container>
      </div>
    )
  }
}

export default ChairsCollection;