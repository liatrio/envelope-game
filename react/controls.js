import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

class Controls extends Component {
  constructor() {
    super();
    this.state = {
      isGoing: false,
      disabled : false,
      teamOneName: '',
      teamTwoName: '',
      facilitator_id: ''

    };

    // bind any handlers in the constructor
    this.togglePlay = this.togglePlay.bind(this);
    this.itemInputChange = this.itemInputChange.bind(this);
    this.setTeamName = this.setTeamName.bind(this);
  }

  togglePlay(val) {
    this.setState({ isGoing: !this.state.isGoing });
  }

  itemInputChange(event){
    console.log('Before Switch');
    switch(event.target.name){
      case 'teamOneInput': {
        console.log('Inside teamOneInput');
        this.setState({teamOneName: event.target.value});
        break;
      }
      case 'teamTwoInput':{
        console.log('Inside teamTwoInput');
      this.setState({teamTwoName: event.target.value});
      break;
      }
    }
  }

  async setTeamName() {
    //if(this.state.disabled) {
    //  return;
    //}
    console.log("before POST")
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({team_name: this.state.teamOneName, team_id: this.state.team_id, faciliatator_id: this.props.facilitatorGets})
    }
    console.log(" before await fetch")
    const response = await fetch('/api/set-team-name', requestOptions)
    const json = await response.json();
    console.log("After team name await");
    this.setState( {facilitator_id: json.facilitator, })

  }

  render() {
    let ic = this.state.isGoing ? faPause : faPlay;
    console.log(this.state.faciltatorId)

    
    return (
      <div>
        <form>
          <label>
           Name:
          <input type="text" onChange= {this.itemInputChange} name="teamOneName" />
          </label>
          <input type="button" onClick= {this.setTeamName}  value="Submit" />
        </form>
        <FontAwesomeIcon icon={ic} spin onClick={this.togglePlay} />
    
      </div>
    )
  }



}

export default Controls
