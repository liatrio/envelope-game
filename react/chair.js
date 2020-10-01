import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import EnvelopeArea from './envelope_area'



class Chair extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeEnvelopes: null,
      seatId: null,
      displayName: null,

    }

    this.chooseSeat = this.chooseSeat.bind(this);
  }

  async chooseSeat() {

    if (this.props.playerSeatId === null) {
      const response = await fetch(`/api/choose-seat/${this.props.gameId}/${this.props.seatId}`)
      const json = await response.json();
      console.log(json);
      if (json.success) {
        console.log(json.seatId);
        this.state.seatId = json.seatId;
        this.props.setSeatId(json.seatId);
      }

      this.state.displayName = prompt("Please enter your display name.");

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: this.state.displayName,
          seatId: this.state.seatId,
        })
      };
      await fetch('/api/set-player-name', requestOptions);
    }
  }

  render() {
    return (
      <div>
        <Button
          className={this.props.is_taken ? "chairFilled" : "chairNotFilled"}
          variant="secondary"
          active={this.props.isTaken || this.props.playerSeatId !== null ? 'false' : 'true'}
          onClick={() => this.chooseSeat(this.props.index, this.props.seatId, this.props.gameId)}>
          <FontAwesomeIcon
            icon={faChair}
            size='7x'
            color={this.props.seatId === this.props.playerSeatId ? 'blue' : this.props.isTaken ? 'red' : 'black'}
          />
           <span class="badge">{this.props.displayName}</span>
        </Button>
        <EnvelopeArea
          envelopes={this.props.envelopes.filter((i) => {
            return i.seatNumber === this.props.seatNumber
          })}
          teamId={this.props.teamId}
          isTeam1={this.props.isTeam1}
          gameId={this.props.gameId}
          seatId={this.props.seatId}
          seatNumber={this.props.seatNumber}
        ></EnvelopeArea>
      </div>
    );
  }
}

export default Chair