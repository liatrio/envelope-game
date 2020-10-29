import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { ReactComponent as Corkboard } from './assets/corkboard.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

import Minimap from './minimap'

class GameProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatsFullError: false,
      disabled: false
    }
    this.togglePlay = this.togglePlay.bind(this);
    this.seatsNotFull = this.seatsNotFull.bind(this);
  }

  async togglePlay() {
    this.setState({ disabled: true });
    this.setState({ seatsFullError: false });
    if (!this.props.isStarted) {
      await fetch(`/api/start-game/${this.props.facilitatorId}/${this.props.gameId}`)

    } else {
      await fetch(`/api/stop-game/${this.props.facilitatorId}/${this.props.gameId}`)
    }
    this.setState({ disabled: false });

  }

  seatsNotFull() {
    this.setState({ seatsFullError: true });
  }

  getFinishedEnvelopes() {
    return this.props.envelopes.filter((e) => {
      return (e.seatNumber === this.props.seatNumber && e.envelopeState === 5);
    }).length;
  }

  render() {
    const facilID = this.props.facilitatorId;
    return (
      <div>
        <div>
        {facilID && this.state.seatsFullError &&
              <Row style={{marginLeft: "0", marginRight: "0"}} className= "justify-content-md-center">Error: Seats are not Full yet</Row>
            }
        {facilID &&
              <Row className= "justify-content-md-center" style={{marginLeft: "0", marginRight: "0"}}>
                <FontAwesomeIcon className="playIcon" 
                icon={this.props.isStarted ? faPause : faPlay} 
                onClick={this.props.seatsFull ? this.togglePlay : this.seatsNotFull} 
                disabled={this.state.disabled} />
              </Row>
            }

            <Row style={{marginLeft: "0", marginRight: "0"}} className= "justify-content-md-center" >
              <div className="display-time clock">{this.props.gameTick ? Math.floor(((this.props.gameTick % 3600) / 60)) : '0'}:{this.props.gameTick % 60 < 10 ? 0 : ''}{this.props.gameTick ? this.props.gameTick % 60 : '0'}</div>
            </Row>

        </div>
        <div style={{width: "900px", top: "10px", left: "50%", transform: "translate(-50%)", position: "relative", overflow: "auto"}}>
          <Card.Img as={Corkboard} alt="Scoreboard"/>    
          <Card.ImgOverlay bsPrefix='card-img-overlay CardImgOverlay'>
            <Card.Body>
            
              <Minimap
                envelopes={this.props.envelopes}
                seats={this.props.seats}
                t1Name={this.props.t1Name}
                t2Name={this.props.t2Name}
                team1Score={this.props.team1Score}
                team2Score={this.props.team2Score}
                gameTick={this.props.gameTick}
                team1Completed={this.props.team1Completed}
                team2Completed={this.props.team2Completed}
              >
              </Minimap>
            </Card.Body>
          </Card.ImgOverlay>
        </div>
      </div>
    );
  }
}

export default GameProgress;
