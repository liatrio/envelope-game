import React, { Component } from 'react'
import Gameprogress from './gameprogress';
import Controls from './controls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChair} from '@fortawesome/free-solid-svg-icons'
import {useParams} from 'react-router-dom'
import {withRouter} from 'react-router'

class Gamearea extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            chairColor: Array(6).fill('black'),
            isStarted: false,
            seats: [],
            team_id_1: '',
            team_id_2: '',
        }
    }
    chooseSeat(index, seat_id)
    {
        console.log(seat_id);
        // api/chooseSeat/gameID/seatID

    }

    async componentDidMount() {
        const gameID = this.props.match.params.gameID;
        console.log(gameID);
        const response = await fetch(`/api/join/${gameID}`)
        const json = await response.json();
        console.log(json);
        this.setState({isStarted: json.is_started, seats: json.seats, team_id_1: json.team_1_id, team_id_2: json.team_2_id});
        console.log(this.state.seats);
        console.log('Team 1 id: ' + json.team_1_id)
        console.log('Team 2 id: ' + json.team_2_id)
    }

    render() {
        var team1Chairs = []
        var team2Chairs = []
        //var chairColor = this.state.chairColor;
        var chairs = this.state.seats;
        chairs.forEach((c, index) => {
            console.log(c.seat_id);
            if (c.is_team_1) {
              team1Chairs.push(<li><button onClick={() => this.chooseSeat(index, c.seat_id)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c.is_taken ? 'blue' : 'black'} /><br/>
          </button></li>);
            }
            else {
                team2Chairs.push(<li><button onClick={() => this.chooseSeat(index, c.seat_id)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c.is_taken ? 'blue' : 'black'} /><br/>
          </button></li>);
            }  
        });
        console.log(team1Chairs);

        console.log(this.props.location.facilitatorID)
        return (
            <div>
                Game Area
                <Gameprogress t1Name = {'Eager Carabou'} t1Begin={4} t1End={9} t2Name={'Gothic Toads'} t2Begin={1} t2End={2}/>
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
