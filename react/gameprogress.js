import React, { Component } from 'react';


class Gameprogress extends Component {
    constructor() {
        super();
    }
    render() {
        const timeSpent = this.props.end - this.props.begin;
        return (
            
            <div>
               <h1>Money Earned</h1>
               <p> { timeSpent } </p>
            </div>   
        );
    }

}

export default Gameprogress;
