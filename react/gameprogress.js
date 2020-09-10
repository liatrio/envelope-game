import React, { Component } from 'react';

function doMath(end, begin){
    return end - begin;
}

class Gameprogress extends Component {
    constructor() {
        super();
    }
    render() {
        const t1TimeSpent = doMath(this.props.t1End, this.props.t1Begin);
        const t2TimeSpent = doMath(this.props.t2End, this.props.t2Begin);
        const profitPerEnvelope = 22;
        return (
            
            <div>
               <h1>Money Earned</h1>
               <p> { this.props.t1Name } --- VS --- { this.props.t2Name }</p>
               <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${ t1TimeSpent  * profitPerEnvelope} 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${ t2TimeSpent * profitPerEnvelope} 
                </span>
            </div>   
        );
    }
}

export default Gameprogress;
