import React, { Component } from 'react';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

class GameProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: false
    }
    this.togglePlay = this.togglePlay.bind(this);
  }

doTime() {
  if (this.props.startTime)  {
    let now = moment.utc(Date.now());
    let countdown = moment.duration(now.diff(this.props.startTime));
    //return countdown._data.seconds;
    return (<p>{countdown._data.minutes}:{countdown._data.seconds}</p>);
  }
  else {
    return '';
  }
}

async togglePlay(val) {
  this.setState({ isGoing: !this.state.isGoing });
  const response = await fetch(`/api/start-game/${this.props.facilitatorGets}/${this.props.gameID}`)
  const json = await response.json();
  console.log(json);
}
  
  render() {
    let ic = this.state.isGoing ? faPause : faPlay;
    const profitPerEnvelope = 22;
    const facilID = this.props.facilitatorGets;
    return (
      <div > 
        <Card style={{ width: '25em' }}>
          <Card.Body>
          
            <h1>Money Earned</h1>
            {facilID && 
              <FontAwesomeIcon icon={ic} spin onClick={this.props.seatsFull ? this.togglePlay : 'null'}/>
            }
            <p> {this.props.t1Name} --- VS --- {this.props.t2Name}</p>
            <h2 >
              ${profitPerEnvelope * 0}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                      {this.doTime()}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${profitPerEnvelope * 0}
            </h2>
            
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default GameProgress;
