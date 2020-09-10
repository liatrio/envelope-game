import React, { Component } from 'react'
import Gameprogress from './gameprogress';

class Gamearea extends Component {
    render() {
        return (
            <div>
                Game Area
                <Gameprogress begin={4} end={9} />
            </div>
        )
    }
}

export default Gamearea
