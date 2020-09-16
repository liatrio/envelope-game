import React, { Component } from 'react'
import Gameprogress from './gameprogress';
import Controls from './controls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChair} from '@fortawesome/free-solid-svg-icons'
import {useParams} from 'react-router-dom'
import './index.css'
import {withRouter} from 'react-router'

class Gamearea extends Component {
    
    constructor(props)
    {
        super(props);
        this.intervalID = '';
        this.state = {
            isStarted: false,
            seats: [],
            team_id_1: '',
            team_id_2: '',
            seconds: 0,
            seatsFull: false,
            teamName_1: 'Unnamed Team 1',
            teamName_2: 'Unnamed Team 2',      
        }

        this.getTeamOneName = this.getTeamOneName.bind(this);
        this.getTeamTwoName = this.getTeamTwoName.bind(this);

    }
    async chooseSeat(index, seat_id)
    {
        const gameID = this.props.match.params.gameID;
        //console.log(seat_id);
        const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
        const json = await response.json();
        //console.log(json);
        // api/chooseSeat/gameID/seatID
    }

    async componentDidMount() {
        this.joinGame();
    }

    async joinGame() {
        const gameID = this.props.match.params.gameID;
        const response = await fetch(`/api/join/${gameID}`)
        const json = await response.json();
        this.setState({isStarted: json.is_started, seats: json.seats});
        this.intervalID = setTimeout(this.joinGame.bind(this), 500);
    }

    async getTeamOneName() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', requestOptions},
            body: JSON.stringify({team_name: this.state.teamOneName, team_id: this.props.team_id_1, faciliatator_id: this.props.location.state.facilitatorID})
          }
        const response = await fetch('/api/set-team-name')
        const json = await response.json();
        
        this.setState( { teamName_1: json.team_name, team_id_1})

    }

    async getTeamTwoName() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', requestOptions},
            body: JSON.stringify({team_name: this.state.teamOneName, team_id: this.props.team_id_2, faciliatator_id: this.props.location.state.facilitatorID})
          }
        const response = await fetch('/api/set-team-name')
        const json = await response.json();
        
        this.setState( { teamName_2: json.team_name})

    }

    async updateGame() {
        const gameID = this.props.match.params.gameID;
        //console.log("interval begin");
        //console.log(gameID);
        const response = await fetch(`/api/updatestate/${gameID}`)
        const json = await response.json();
        //console.log(json);
        this.setState({isStarted: json.is_started, seats: json.seats, team_id_1: json.team_1_id, team_id_2: json.team_2_id});
        //console.log(this.state.seats);
        
    }

    render() {
        var team1Chairs = []
        var team2Chairs = []
        var chairs = this.state.seats;
        chairs.forEach((c, index) => {
            //console.log(c.is_taken);
            if (c.is_team_1) {
              team1Chairs.push(<li><button disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c.is_taken ? 'blue' : 'black'} /><br/>
          </button></li>);
            }
            else {
                team2Chairs.push(<li><button disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c.is_taken ? 'blue' : 'black'} /><br/>
          </button></li>);
            }  
        });
        return (
            <div>
                Game Area
                <Gameprogress t1Name = {this.state.teamName_1} t1Begin={4} t1End={9} t2Name={this.state.teamName_2} t2Begin={1} t2End={2}/>
                <ul>{team1Chairs}
                </ul>
                <ul>
                {team2Chairs}
                </ul>
                <Controls facilitatorGets = {this.props.location.state.facilitatorID} team_id_1 = {this.state.team_id_1} team_id_2 = {this.state.team_id_2} />
            </div>
        )

    }
}

export default Gamearea
