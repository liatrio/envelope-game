import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

class Controls extends Component {
  constructor() {
    super();
    this.state = {
      isGoing: false
    };

    // bind any handlers in the constructor
    this.togglePlay = this.togglePlay.bind(this);
  }

  togglePlay(val) {
    this.setState({ isGoing: !this.state.isGoing });
  }

  render() {
    let ic = this.state.isGoing ? faPause : faPlay;
    return (
      <div>
        <FontAwesomeIcon icon={ic} spin onClick={this.togglePlay} />
      </div>
    )
  }



}

export default Controls
