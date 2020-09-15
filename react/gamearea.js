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
        const gameID = this.props.match.params.gameID;
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

        console.log(this.props.location.facilitatorID)
        return (
            <div>
                Game Area
                <Gameprogress t1Name = {'Eager Carabou'} t1Begin={4} t1End={9} t2Name={'Gothic Toads'} t2Begin={1} t2End={2}/>
                <Controls facilitatorGets = {this.props.location.state.facilitatorID} />

            </div>
        )

    }
}

export default Gamearea
