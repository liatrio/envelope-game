import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChair} from '@fortawesome/free-solid-svg-icons'
import {useParams} from 'react-router-dom'
class Chairs extends Component {
    constructor(props)
    {
        super(props);
    }
    async chooseSeat(index, seat_id, gameID)
    {
        console.log(seat_id);
        const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
        const json = await response.json();
        console.log(json);
        // api/chooseSeat/gameID/seatID
    }

render() {
    var team1Chairs = []
    var team2Chairs = []
    var chairs = this.props.seats;
    const gameID = this.props.gameID;
    chairs.forEach((c, index) => {
    //console.log(c.is_taken);
    if (c.is_team_1) {
        team1Chairs.push(<li><button className={c.is_taken ? "chairFilled" : "chairNotFilled"} disabled={c.is_taken ? true : false} onClick={() => this.chooseSeat(index, c.seat_id, gameID)}>
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
        <ul>{team1Chairs}
        </ul>
        <ul>{team2Chairs}
        </ul>
        </div>
    )
    }
}

export default Chairs;