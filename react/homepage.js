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
            <br/><br/>- There will be two evenly sized teams; one team for Batch Delivery and one team for Flow Delivery
            <br/><br/>- Both teams will be given the task of using teamwork to move along the envelopes through the team into delivery of the envelopes to the customer
            <br/><br/>- Each person on the batch team will be designated to work with ten envelopes at a time before handing off to the next partner in their team
            <br/><br/>- The Flow Team will have the luxury of passing on the envelopes to their team-mates right after finishing work on one envelope
            <br/><br/>

            <h5>Playing The Game</h5>
            - When loading up the game, there will be designated seats for each team to join the Game
            <br/><br/>- The Facilatator may have decided your team, if so, then select a seat on the corresponding batch/flow team given
            <br/><br/>- Once the table is filled with people in their seats, the Facilatator will be able to start the Game
            <br/><br/>- There are three roles per team: Product Owner, Development, and Testing, you will be assigned that role based on the seat chosen 
            <br/><br/>- When the game starts, the Product Owner will be first to go and they will stamp the envelope with a number corresponding to the envelope and then they pass it to the Development
            <br/><br/>- Development will take the envelope, open it, and stamp on the index card the number that they see on the envelope and then they pass the envelope off to the Testing partner
            <br/><br/>- Testing will open the envelope, take the index card and adds a post-it note onto the index card that matches the number on the envelope and then they submit it to production
            <br/>
            <button onClick={this.createGame}>
            Create a Game    
            </button>
            </div>
        )
    }
}

export default homepage;
