import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CorkboardUrl, { ReactComponent as Corkboard} from './assets/corkboard.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      await fetch(`/api/start-game/${this.props.facilitatorId}/${this.props.gameID}`)

    } else {
      await fetch(`/api/stop-game/${this.props.facilitatorId}/${this.props.gameID}`)
    }
    this.setState({ disabled: false });

  }

  seatsNotFull() {
    this.setState({ seatsFullError: true });
  }

  render() {
    let ic = this.props.isStarted ? faPause : faPlay;
    const facilID = this.props.facilitatorId;
    return (
      <div className="card" style={{width: "35%", top: "15%", left: "50%", marginLeft: "-17.5%", position: "absolute"}}>
        <Card.Img as={Corkboard} alt="Scoreboard"/>    
        <Card.ImgOverlay bsPrefix='card-img-overlay CardImgOverlay'>
          <Card.Body>
            <Row className= "justify-content-md-center">Money Earned </Row>
            {facilID &&
              <Row className= "justify-content-md-center">
                <FontAwesomeIcon className="playIcon" icon={ic} spin onClick={this.props.seatsFull ? this.togglePlay : this.seatsNotFull} disabled={this.state.disabled} />
              </Row>
            }
            {facilID && this.state.seatsFullError &&
              <Row className= "justify-content-md-center">Error: Seats are not Full yet</Row>
            }
            <Row className= "justify-content-md-center"> {this.props.t1Name} --- VS --- {this.props.t2Name}</Row>
            <Row className= "justify-content-md-center">
              ${this.props.team1Score}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {this.props.gameTick ? Math.floor(((this.props.gameTick % 3600) / 60)) : '0'}:{this.props.gameTick ? this.props.gameTick % 60 : '0'}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${this.props.team2Score}
            </Row>
            <Minimap
              envelopes={this.props.envelopes}
              seats={this.props.seats}
            >
            </Minimap>
          </Card.Body>
        </Card.ImgOverlay>
      </div>
    );
  }
}

export default GameProgress;
