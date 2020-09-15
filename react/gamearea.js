import React, { Component } from 'react'
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
            seconds: 0,
            seatsFull: false,       
        }
    }
    async chooseSeat(index, seat_id)
    {
        const gameID = this.props.match.params.gameID;
        console.log(seat_id);
        const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
        const json = await response.json();
        console.log(json);
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

    async updateGame() {
        const gameID = this.props.match.params.gameID;
        console.log("interval begin");
        console.log(gameID);
        const response = await fetch(`/api/updatestate/${gameID}`)
        const json = await response.json();
        console.log(json);
        this.setState({isStarted: json.is_started, seats: json.seats});
        console.log(this.state.seats);
        
    }

    render() {
        var team1Chairs = []
        var team2Chairs = []
        var chairs = this.state.seats;
        chairs.forEach((c, index) => {
            console.log(c.is_taken);
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
                Game Area<br/>
                <ul>{team1Chairs}
                </ul>
                <ul>
                {team2Chairs}
                </ul>
            </div>
        )
    }
}

export default Gamearea
