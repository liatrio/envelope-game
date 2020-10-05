import React, { Component } from 'react'
import { Modal, Button } from "react-bootstrap";



class MyVerticallyCenteredModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      show: true,
      showModal: true,
    }
    
        // bind any handlers in the constructor
        this.teamOneChange = this.teamOneChange.bind(this);
        this.teamTwoChange = this.teamTwoChange.bind(this);
        this.setTeamOneName = this.setTeamOneName.bind(this);
        this.setTeam2Name = this.setTeam2Name.bind(this);
        this.setTeamNames = this.setTeamNames.bind(this);
  }
  async setTeamNames() {
    await this.setTeamOneName();
    await this.setTeam2Name();
    this.props.onHide();
    this.setState({show: false});
    this.setState({showModal: false});
  }

  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ team2Name: event.target.value });
  }

  async setTeamOneName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();
    console.log(requestOptions);
    console.log(json);
  }

  async setTeam2Name() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.team2Name,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }


  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Choose Team Names
              </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>
              Team One Name: <input type="text" onChange={this.teamOneChange} name="teamOneName" />
              <br />
              Team Two Name: <input type="text" onChange={this.teamTwoChange} name="team2Name" />
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.setTeamNames}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class Controls extends Component {
  constructor() {
    super();
    this.state = {
      disabled: false,
      teamOneName: '',
      team2Name: '',
      facilitatorId: '',
      modalShow: true,
    };
  }

  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ team2Name: event.target.value });
  }


  async setTeamOneName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }

  async setTeam2Name() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.team2Name,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }

  render() {

    let modalClose = () => this.setState({ modalShow: false });
    return (
      <div>

        <MyVerticallyCenteredModal
          facilitatorId = {this.props.facilitatorId}
          team1 = {this.props.team1}
          team2 = {this.props.team2}
          show = {this.state.modalShow}
          onHide={modalClose}
        />

      </div>
    )
  }
}

export default Controls
