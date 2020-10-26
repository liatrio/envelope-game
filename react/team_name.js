import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

class TeamNameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOneName: '',
      teamTwoName: '',
      waiting: false,
    };
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamNames = this.setTeamNames.bind(this);
  }


  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ teamTwoName: event.target.value });
  }

  async setTeamNames() {
    this.setState({ waiting: true });

    const teamOneRequest = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', teamOneRequest);

    const teamTwoRequest = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamTwoName,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', teamTwoRequest);

    this.setState({ waiting: false });
    this.props.toggleControls();
  }

  render() {
    return (
      <Row className="justify-content-md-center">
        <Form>
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Team One Name"
                name="team1"
                onChange={this.teamOneChange}
              >
              </Form.Control>
              <Form.Control
                type="text"
                placeholder="Team Two Name"
                name="team2"
                onChange={this.teamTwoChange}
              >
              </Form.Control>
              <br></br>
              <Row className="justify-content-md-center">
                <Button onClick={this.setTeamNames} disabled={this.state.waiting}>Update</Button>
              </Row>
            </Form.Group>
          </Col>
        </Form>
      </Row>
    );
  }
}

export default TeamNameForm