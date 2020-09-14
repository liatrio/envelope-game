import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChair} from '@fortawesome/free-solid-svg-icons'
import {useParams} from 'react-router-dom'

class Gamearea extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            gameID: null,
            color: Array(6).fill('black'),
            isStarted: false,
            team1Seats: [],
            team2Seats: []
        }
    }
    chooseSeat(index)
    {
        let colorChoice = this.state.color;
        colorChoice[index] = 'blue';
        console.log(index);
        this.setState({color: colorChoice});
    }

    async componentDidMount() {
        let gameID = useParams();
        console.log(gameID);
        const response = await fetch('/api/join/{gameID}')
        const json = await response.json();
        this.setState({isStarted: json.isStarted, })
    }

    render() {
        
        var chairs = this.state.color;
        var team1Chairs = [];
        var team2Chairs = [];
        /* chairs.forEach(c, index => {
            if (c.isTeamOne) {
              team1Chairs.append(<li><button onClick={() => this.chooseSeat(index)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c} /><br/>
          </button></li>);
            }
            else {
                team2Chairs.append(<li><button onClick={() => this.chooseSeat(index)}>
              <FontAwesomeIcon icon={faChair} size = '7x' color={c} /><br/>
          </button></li>);
            }  
        }); */

        return (
            <div>
                Game Area<br/>
                <ul>{team1Chairs}</ul>
            </div>
        )
    }
}

export default Gamearea
