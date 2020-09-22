import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from "react-bootstrap";


function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <label>
            Team One Name: <input type="text" onChange={props.teamOneChange} name="teamOneName" />
            <input type="button" onClick={props.setTeamOneName} value="Submit" />
            <br />
            Team Two Name: <input type="text" onChange={props.teamTwoChange} name="teamTwoName" />
            <input type="button" onClick={props.setTeamTwoName} value="Submit" />
          </label>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Facilitator Controls
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}


class Controls extends Component {
  constructor() {
    super();
    this.state = {
      isGoing: false,
      disabled: false,
      teamOneName: '',
      teamTwoName: '',
      facilitator_id: ''

    };

    // bind any handlers in the constructor
    this.togglePlay = this.togglePlay.bind(this);
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamOneName = this.setTeamOneName.bind(this);
    this.setTeamTwoName = this.setTeamTwoName.bind(this);
  }

  async togglePlay(val) {
    this.setState({ isGoing: !this.state.isGoing });
    const response = await fetch(`/api/start-game/${this.props.facilitatorGets}/${this.props.gameID}`)
    const json = await response.json();
    console.log(json);
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
    let ic = this.state.isGoing ? faPause : faPlay;

    return (
      <div>
        <form>
          <label>
          Team One Name: <input type="text" onChange= {this.teamOneChange} name="teamOneName" />
          <input type="button" onClick= {this.setTeamOneName}  value="Submit" />
          <br />
          Team Two Name: <input type="text" onChange= {this.teamTwoChange} name="teamTwoName" />
          <input type="button" onClick= {this.setTeamTwoName}  value="Submit" />
          </label>
        </form>
        <FontAwesomeIcon icon={ic} spin onClick={this.props.seatsFull ? this.togglePlay : 'null'} />
    
      </div>
    )
  }
}

export default Controls
