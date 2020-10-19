import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import MinimapStatus from './minimap_status'

class Minimap extends Component {
  
  getDisplayName(seatNumber, isTeam1) {
    console.log(this.props.seats)
    for (var s = 0; s < this.props.seats.length; s++) {
      if (this.props.seats[s].seatNumber === seatNumber && this.props.seats[s].isTeam1 === isTeam1) {
        console.log( "Display Name: " + this.props.seats[s].displayName);
        return this.props.seats[s].displayName;
      }
    }
  }

  render() {

    return (
      <Container fluid>
        <Row>
          <Col lg={false}>
            <h5>Team {this.props.t1Name} Progress</h5>
            <h7>Money Earned: ${this.props.team1Score}</h7><br/> 
            <h7>Envelopes Completed: </h7>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={0}
              isTeam1={1}
              gameTick={this.props.gameTick}
            >
            </MinimapStatus>
            {this.getDisplayName(0, true)}
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={1}
              isTeam1={1}
              gameTick={this.props.gameTick}
            >
            </MinimapStatus>
            {this.getDisplayName(1, true)}
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={2}
              isTeam1={1}
              gameTick={this.props.gameTick}
            >
            </MinimapStatus>
            {this.getDisplayName(2, true)}
          </Col>
          <Col md="auto">
            {this.props.gameTick ? Math.floor(((this.props.gameTick % 3600) / 60)) : '0'}:{this.props.gameTick ? this.props.gameTick % 60 : '0'}
          </Col>
          <Col lg={false}>
          <h5>Team {this.props.t2Name} Progress</h5>
            <h7>Money Earned: ${this.props.team2Score}</h7><br/> 
            <h7>Envelopes Completed: </h7> 
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={0}
              isTeam1={0}
              gameTick={this.props.gameTick}
            >
            </MinimapStatus>
            {this.getDisplayName(0, false)}
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={1}
              isTeam1={0}
              gameTick={this.props.gameTick}
            >
            </MinimapStatus>
            {this.getDisplayName(1, false)}
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={2}
              isTeam1={0}
              gameTick={this.props.gameTick}
            >
            </MinimapStatus>
            {this.getDisplayName(2, false)}
          </Col>
        </Row>
      </Container>
    );
  }

}

export default Minimap