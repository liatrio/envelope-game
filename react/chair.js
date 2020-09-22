import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import EnvelopeArea from './envelope_area'



class Chair extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active_envelope: null
    }

    this.chooseSeat = this.chooseSeat.bind(this);
    this.nextChair = this.nextSeat.bind(this);
  }

  async chooseSeat() {
    if (this.props.playerSeatId === null) {
      const response = await fetch(`/api/choose-seat/${this.props.game_id}/${this.props.seat_id}`)
      const json = await response.json();
      console.log(json);
      if (json.success) {
        console.log(json.seat_id);
        this.props.setSeatId(json.seat_id);
      }
    }
  }

  // returns the id of the next seat, or "finish" if it is the last seat
  nextSeat() {
    if (this.props.seat_number === 3) {
      return "finish";
    }
    return this.props.otherChairs.filter((c) => {
      return c.is_team_1 === this.props.is_team_1;
    }).find((c) => {
      return c.seat_number === this.props.seat_number + 1;
    }).seat_id;
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
          is_team_1={this.props.is_team_1}
          game_id={this.props.game_id}
          seat_id={this.props.seat_id}
          seat_number={this.props.seat_number}
          next_seat={this.nextSeat}
        ></EnvelopeArea>
      </div>
    );
  }
}

export default Chair