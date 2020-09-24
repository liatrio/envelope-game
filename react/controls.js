import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from "react-bootstrap";



class MyVerticallyCenteredModal extends Component {
  constructor(props) {
    super(props);
    this.state= {
      disabled: false,
      show: true,
      teamOneName: '',
      teamTwoName: '',
      facilitator_id: '',
    }
    this.setTeamNames = this.setTeamNames.bind(this);
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamOneName = this.setTeamOneName.bind(this);
    this.setTeamTwoName = this.setTeamTwoName.bind(this);
  }
  async setTeamNames(){
    //if (this.state.disabled) {
    //  return;
    //}
    //this.setState({ disabled: true });
    await this.setTeamOneName();
    await this.setTeamTwoName();
    
    this.props.onHide();
    this.setState({show: false});
  }

  teamOneChange(event) { this.setState({ teamOneName: event.target.value }); }

  teamTwoChange(event) { this.setState({ teamTwoName: event.target.value }); }


  async setTeamOneName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_name: this.state.teamOneName,
        team_id: this.props.team_id_1,
        facilitator_id: this.props.facilitatorGets,
      })
    };
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();
    console.log(requestOptions);
    console.log(json);
  }

  async setTeamTwoName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_name: this.state.teamTwoName,
        team_id: this.props.team_id_2,
        facilitator_id: this.props.facilitatorGets,
      })
    };
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();

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
              Team Two Name: <input type="text" onChange={this.teamTwoChange} name="teamTwoName" />
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
      modalShow: true,
    };
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false});
    return (
      <div>

          <MyVerticallyCenteredModal
            facilitatorGets={this.props.facilitatorGets}
            team_id_1={this.props.team_id_1}
            team_id_2={this.props.team_id_2}
            show={this.state.modalShow}
            onHide={modalClose}
          />
      </div>
    )
  }
}

export default Controls