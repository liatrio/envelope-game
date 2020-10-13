import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Corkboard from './assets/corkboard.svg';
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
      <div>
        <Card.Img as={Corkboard} src={Corkboard} alt="Scoreboard" style={{width: "40%", height: "40%"}}/>
        <Card.ImgOverlay style={{width: "40%", height: "40%"}}>
          <Card.Text>
            <h1>Money Earned </h1>
            {facilID &&
              <FontAwesomeIcon className="playIcon" icon={ic} spin onClick={this.props.seatsFull ? this.togglePlay : this.seatsNotFull} disabled={this.state.disabled} />
            }
            {facilID && this.state.seatsFullError &&
              <h5>Error: Seats are not Full yet</h5>
            }
            <p> {this.props.t1Name} --- VS --- {this.props.t2Name}</p>
            <h2 >
              ${this.props.team1Score}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {this.props.gameTick ? Math.floor(((this.props.gameTick % 3600) / 60)) : '0'}:{this.props.gameTick ? this.props.gameTick % 60 : '0'}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${this.props.team2Score}
            </h2>
            <Minimap
              envelopes={this.props.envelopes}
            >
            </Minimap>
          </Card.Text>
        </Card.ImgOverlay>
      </div>
    );
  }
}

export default GameProgress;
