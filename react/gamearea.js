import React, { Component } from 'react'
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
        this.setState({isStarted: json.is_started, seats: json.seats});
        console.log(this.state.seats);
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
