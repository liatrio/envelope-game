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
        this.setState({isStarted: json.is_started, seats: json.seats, team_id_1: json.team_1_id, team_id_2: json.team_2_id, teamName_1: json.teamName_1, teamName_2: json.teamName_2});
        this.intervalID = setTimeout(this.joinGame.bind(this), 500);
        
        if (this.state.seats.every(s => s.is_taken === true))
        {
            //this.intervalID = setTimeout(this.updateGame.bind(this), 500);
          
            clearTimeout(this.intervalID);
            this.updateGame();
        }
    }

    async updateGame() {
        const gameID = this.props.match.params.gameID;
        //const response = await fetch(`/api/updatestate/${gameID}`)
        const response = await fetch(`/api/game-state/${gameID}`)
        const json = await response.json();
        this.setState({isStarted: json.is_started, seats: json.seats, team_id_1: json.team_1_id, team_id_2: json.team_2_id});
        
    }

    render() {
        var team1Chairs = []
        var team2Chairs = []
        var chairs = this.state.seats;
        chairs.forEach((c, index) => {
            //console.log(c.is_taken);
            if (c.is_team_1) {
              team1Chairs.push(<li><button className={c.is_taken ? "chairFilled" : "chairNotFilled"} disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c.is_taken ? 'blue' : 'black'} /><br/>
          </button></li>);
            }
            else {
                team2Chairs.push(<li><button className={c.is_taken ? "chairFilled" : "chairNotFilled"} disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id)}>
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
