import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MinimapStatus from './minimap_status'

class Minimap extends Component {
  
  getDisplayName(seatNumber, isTeam1) {
    for (var s = 0; s < this.props.seats.length; s++) {
      if (this.props.seats[s].seatNumber === seatNumber && this.props.seats[s].isTeam1 === isTeam1) {
        return this.props.seats[s].displayName;
      }
    }
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={false}>
            <h1 className="board-title">FLOW</h1>
            <h5>Team {this.props.t1Name} Progress</h5>
            <h5>Money Earned: ${this.props.team1Score}</h5><br/> 
            <h5>Total Completed: {this.props.team1Completed}</h5>
            <hr></hr>
            <Row>
              <Col>
                  <div className="player-svg"></div>
              </Col>
              <Col>
                  <div className="env-open-svg"></div>
              </Col>
            </Row>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={0}
              isTeam1={true}
              gameTick={this.props.gameTick}
              displayName={this.getDisplayName(0, true)}
            >
            </MinimapStatus>           
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={1}
              isTeam1={true}
              gameTick={this.props.gameTick}
              displayName={this.getDisplayName(1, true)}
            >
            </MinimapStatus>            
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={2}
              isTeam1={true}
              gameTick={this.props.gameTick}
              displayName={this.getDisplayName(2, true)}
            >
            </MinimapStatus>            
          </Col>
          <Col lg={false}>
          <h1 className="board-title">BATCH</h1>
          <h5>Team {this.props.t2Name} Progress</h5>
            <h5>Money Earned: ${this.props.team2Score}</h5><br/> 
            <h5>Total Completed: {this.props.team2Completed}</h5> 
            <hr></hr>
            <Row>
              <Col>
                  <div className="player-svg"></div>
              </Col>
              <Col>
                  <div className="env-open-svg"></div>
              </Col>
              <Col>
                  <div className="env-ok-svg"></div>
              </Col>
            </Row>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={0}
              isTeam1={false}
              gameTick={this.props.gameTick}
              displayName={this.getDisplayName(0, false)}
            >
            </MinimapStatus>           
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={1}
              isTeam1={false}
              gameTick={this.props.gameTick}
              displayName={this.getDisplayName(1, false)}
            >
            </MinimapStatus>
            <MinimapStatus
              envelopes={this.props.envelopes}
              seatNumber={2}
              isTeam1={false}
              gameTick={this.props.gameTick}
              displayName={this.getDisplayName(2, false)}
            >
            </MinimapStatus>          
          </Col>
        </Row>
       
      </Container>
    );
  }

}

export default Minimap