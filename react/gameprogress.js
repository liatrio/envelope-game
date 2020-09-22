import React, { Component } from 'react';
import moment from 'moment';
import Card from 'react-bootstrap/Card';

function doMath(end, begin) {
  return end - begin;
}



class Gameprogress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: []
    }
  }

doTime() {
  if (this.props.startTime)  {
    var now = moment.utc(Date.now());
    let countdown = moment.duration(now.diff(this.props.startTime));
    console.log(countdown);
    return (<p>{countdown._data.minutes}:{countdown._data.seconds}:{countdown._data.milliseconds}</p>);
  }
  else {
    return '';
  }
}
  
  render() {
    const t1TimeSpent = doMath(this.props.t1End, this.props.t1Begin);
    const t2TimeSpent = doMath(this.props.t2End, this.props.t2Begin);
    //console
    //var countdown = this.doTime(this.props.startTime);
    const profitPerEnvelope = 22;
    return (
      <div >
        
        <Card style={{ width: '25em' }}>
          <Card.Body>
          
            <h1>Money Earned</h1>
            <p> {this.props.t1Name} --- VS --- {this.props.t2Name}</p>
            <h2 >
              ${t1TimeSpent * profitPerEnvelope}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                      {this.doTime()}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${t2TimeSpent * profitPerEnvelope}
            </h2>
            
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Gameprogress;
