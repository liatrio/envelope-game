import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import './index.css'



class Team extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <Container>
          <div>
            <Col><ul className="chairColumn">{this.props.chairs}</ul></Col>
          </div>
        </Container>
      </div>
    );
  }
}

export default Team