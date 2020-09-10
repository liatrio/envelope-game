import React, { Component } from 'react'
import Gameprogress from './gameprogress';

class Gamearea extends Component {
    render() {
        return (
            <div>
                Game Area
                <Gameprogress t1Name = {'Eager Carabou'} t1Begin={4} t1End={9} t2Name={'Gothic Toads'} t2Begin={1} t2End={2}/>
            </div>
        )
    }
}

export default Gamearea
