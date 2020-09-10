import React, { Component } from 'react'

class Homepage extends Component {
    createGame() {
        console.log("in create game");
    }
    render() {
        return (
            <div>
            <h1 data-testid = '123'>The Envelope Game</h1>
            <h5>About The Game</h5>
            <button onClick={this.createGame}>
            Create a Game    
            </button>
            </div>
        )
    }
}

export default Homepage;
