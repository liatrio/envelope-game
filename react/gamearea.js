import React, { Component } from 'react'
import Controls from './controls'

class Gamearea extends Component {
    constructor() {
        super();
    }
    render() {
        console.log(this.props.location.facilitatorID)
        return (
            <div>
                Game Area
                <Controls />
            </div>
        )
    }
}

export default Gamearea
