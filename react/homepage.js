import React, { Component } from 'react'

class homepage extends Component {
    createGame() {
        console.log("in create game");
    }
    render() {
        return (
            <div>
            <h1>The Envelope Game</h1>
            <h5>About The Game</h5>
            - The Envelope Game is a great exercise to show the differences in the different delivery methods.
            <br/>- There will be two evenly numbered teams; one team for Batch Delivery and one team for Flow Delivery
            <br/>- Both teams will be given the task of using teamwork to move along the envelopes through the team into delivery of the envelopes
            <br/>- Each person on the batch team will be designated to work with ten envelopes at a time before handing off to the next partner in their team
            <br/>- The Flow Team will have the luxury of passing on the envelopes to their team-mates right away
            <br/>
            <button onClick={this.createGame}>
            Create a Game    
            </button>
            </div>
        )
    }
}

export default homepage;
