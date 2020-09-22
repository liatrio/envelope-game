import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';

function doMath(end, begin) {
  return end - begin;
}

class Gameprogress extends Component {
  constructor() {
    super();
  }
  render() {
    const t1TimeSpent = doMath(this.props.t1End, this.props.t1Begin);
    const t2TimeSpent = doMath(this.props.t2End, this.props.t2Begin);
    const profitPerEnvelope = 22;
    return (
      <div >
        
        <Card style={{ width: '25em' }}>
          <Card.Body>
          
            <h1>Money Earned</h1>
            <p> {this.props.t1Name} --- VS --- {this.props.t2Name}</p>
            <h2 >
              ${t1TimeSpent * profitPerEnvelope}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${t2TimeSpent * profitPerEnvelope}
            </h2>

          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Gameprogress;
