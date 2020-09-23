import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { Modal, Button } from "react-bootstrap";



class MyVerticallyCenteredModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    }
    this.setTeamNames = this.setTeamNames.bind(this);
  }
  async setTeamNames() {
    if (this.state.disabled) {
      return;
    }
    this.setState({ disabled: true });
    await this.props.setTeamOneName();
    await this.props.setTeamTwoName();
    this.props.onHide();
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
              Team One Name: <input type="text" onChange={this.props.teamOneChange} name="teamOneName" />
              <br />
              Team Two Name: <input type="text" onChange={this.props.teamTwoChange} name="teamTwoName" />
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
      teamTwoName: '',
      facilitator_id: '',
      modalShow: false,
    };

    // bind any handlers in the constructor
    
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamOneName = this.setTeamOneName.bind(this);
    this.setTeamTwoName = this.setTeamTwoName.bind(this);
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
    
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <div>

        <Button
          variant="primary"
          onClick={() => this.setState({ modalShow: true })}
        >
          Facilitator Controls
      </Button>

        <MyVerticallyCenteredModal
          setTeamOneName={this.setTeamOneName}
          setTeamTwoName={this.setTeamTwoName}
          teamOneChange={this.teamOneChange}
          teamTwoChange={this.teamTwoChange}
          show={this.state.modalShow}
          onHide={modalClose}
        />

      </div>
    )
  }
}

export default Controls
