import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

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

  togglePlay(val) {
    this.setState({ isGoing: !this.state.isGoing });
  }

  teamOneChange(event) { this.setState({ teamOneName: event.target.value }); }

  teamTwoChange(event) { this.setState({ teamTwoName: event.target.value }); }


  async setTeamOneName() {
    console.log("Entered setTeamOneName function");
    console.log("Before Await Team one");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_name: this.state.teamOneName,
        team_id: this.props.team_id_1,
        facilitator_id: this.props.facilitatorGets,
      })
    };
    console.log(requestOptions);
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();

    console.log(json);
    console.log("Finished setTeamOneName");
  }

  async setTeamTwoName() {
    console.log("Entered setTeamTwoName function")
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_name: this.state.teamTwoName,
        team_id: this.props.team_id_2,
        facilitator_id: this.props.facilitatorGets,
      })
    };

    console.log(requestOptions);
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();

    console.log(json);
    console.log("Finished setTeamTwoName");
  }

  render() {
    let ic = this.state.isGoing ? faPause : faPlay;
    //console.log(this.state.faciltatorId)


    return (
      <div>
        <form>
          <label>
            Team One Name: <input type="text" onChange={this.teamOneChange} name="teamOneName" />
            <input type="button" onClick={this.setTeamOneName} value="Submit" />
            <br />
          Team Two Name: <input type="text" onChange={this.teamTwoChange} name="teamTwoName" />
            <input type="button" onClick={this.setTeamTwoName} value="Submit" />
          </label>
        </form>
        <FontAwesomeIcon icon={ic} spin onClick={this.togglePlay} />

      </div>
    )
  }



}

export default Controls
