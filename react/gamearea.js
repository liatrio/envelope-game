import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChair} from '@fortawesome/free-solid-svg-icons'

class Gamearea extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            color: Array(6).fill('black')
        }
    }
    chooseSeat(c, index)
    {
        let colorChoice = this.state.color;
        colorChoice[index] = 'blue';
        console.log(index);
        this.setState({color: colorChoice});
    }
    render() {
        //const = [FontAwesomeIcon icon={faChair} size = '7x' color={this.state.color[0]]
        var chairs = this.state.color;
        console.log(chairs);
        return (
            <div>
                Game Area<br/>
                <ul>
                    {chairs.map((c, index) =>
                    <button onClick={() => this.chooseSeat(chairs, index)}>
                        <FontAwesomeIcon key={c.toString} icon={faChair} size = '7x' color={c} /><br/>
                    </button>)}
                </ul>
                
                
            </div>
        )
    }
}

export default Gamearea
