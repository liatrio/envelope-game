import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import './index.css'



class Team extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return(
      <div>
        <Col><ul className="chairColumn">{this.props.chairs}</ul></Col>
      </div>
    );
  }
}

export default Team