import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import EnvelopeArea from './envelope_area'



class Chair extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active_envelope: null,
      seat_id: null,
      display_name: null,

    }

    this.chooseSeat = this.chooseSeat.bind(this);
  }

  async chooseSeat() {

    if (this.props.playerSeatId === null) {
      const response = await fetch(`/api/choose-seat/${this.props.game_id}/${this.props.seat_id}`)
      const json = await response.json();
      console.log(json);
      if (json.success) {
        console.log(json.seat_id);
        this.state.seat_id = json.seat_id;
        this.props.setSeatId(json.seat_id);
      }

      this.state.display_name = prompt("Please enter your display name.");

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: this.state.display_name,
          seat_id: this.state.seat_id,
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
          active={this.props.is_taken || this.props.playerSeatId !== null ? 'false' : 'true'}
          onClick={() => this.chooseSeat(this.props.index, this.props.seat_id, this.props.game_id)}>
          <FontAwesomeIcon
            icon={faChair}
            size='7x'
            color={this.props.seat_id === this.props.playerSeatId ? 'blue' : this.props.is_taken ? 'red' : 'black'}
          />
        </Button>
        <EnvelopeArea
          envelopes={this.props.envelopes.filter((i) => {
            return i.seat_number === this.props.seat_number
          })}
          team_id={this.props.team_id}
          is_team_1={this.props.is_team_1}
          game_id={this.props.game_id}
          seat_id={this.props.seat_id}
          seat_number={this.props.seat_number}
        ></EnvelopeArea>
      </div>
    );
  }
}

export default Chair