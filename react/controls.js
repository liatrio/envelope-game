import React, { Component } from 'react'
import { Modal, Button } from "react-bootstrap";



class MyVerticallyCenteredModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      show: true,
      teamOneName: '',
      teamTwoName: '',
      facilitatorId: '',
    }
        // bind any handlers in the constructor
        this.teamOneChange = this.teamOneChange.bind(this);
        this.teamTwoChange = this.teamTwoChange.bind(this);
        this.setTeam1Name = this.setTeam1Name.bind(this);
        this.setTeam2Name = this.setTeam2Name.bind(this);
        this.setTeamNames = this.setTeamNames.bind(this);
  }



  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ teamTwoName: event.target.value });
  }

  async setTeamNames(){
    //if (this.state.disabled) {
    //  return;
    //}
    //this.setState({ disabled: true });
    await this.setTeam1Name();
    await this.setTeam2Name();
    
    this.props.onHide();
    this.setState({show: false});
    this.setState({modalShow: false});
  }

  async setTeam1Name() {
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
        teamName: this.state.teamTwoName,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();
    console.log(requestOptions);
    console.log(json);
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
              Team One Name: <input type="text" onChange={this.teamOneChange} name="team1Name" />
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
      isGoing: false,
      disabled: false,
      facilitatorId: '',
      modalShow: true,
    };
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false});
    return (
      <div>

          <MyVerticallyCenteredModal
            facilitatorId={this.props.facilitatorId}
            team1={this.props.team1}
            team2={this.props.team2}
            show={this.state.modalShow}
            onHide={modalClose}
          />
      </div>
    )
  }
}

export default Controls