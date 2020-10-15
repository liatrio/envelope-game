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
    let isTeamOne = null
    const seatID = this.props.playerSeatId;
    console.log("12 " + seatID);
    this.props.seats.forEach((c, index) => {
      if (c.isTeam1 && c.seatId == seatID) {
        isTeamOne = c.isTeam1;
        team1Chairs.push(
          
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
        );
      } else if (!c.isTeam1 && c.seatId == seatID) {
        isTeamOne = c.isTeam1;
        team2Chairs.push(
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
        );
      }
    });
    return (
      <div>
            
              {isTeamOne && 
              <div className= "area" style={{width: "35%", top: "50%", left: "50%", marginLeft: "-17.5%", position: "absolute"}}>  
                {team1Chairs}
              </div>
              }
              {!isTeamOne &&
              <div className= "area2" style={{width: "35%", top: "50%", left: "50%", marginLeft: "-17.5%", position: "absolute"}}>
                {team2Chairs}
              </div>
              }
      </div>
    )
  }
}

export default ChairsCollection;