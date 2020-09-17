import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import { faSquareFull } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'



class Chair extends Component {

  constructor(props) {
    super(props);
    this.chooseSeat = this.chooseSeat.bind(this);
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


  render() {
    if (this.props.is_team_1) {
      return (
        <li key={this.props.seat_id}>
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
          <FontAwesomeIcon icon={faSquareFull} size='7x' color='brown' />
        </li>
      );
    } else {
      return (
        <li key={this.props.seat_id}>
          <FontAwesomeIcon icon={faSquareFull} size='7x' color='brown' />
          <Button
            className={this.props.is_taken ? "chairFilled" : "chairNotFilled"}
            variant="secondary"
            active={this.props.is_taken || this.props.playerSeatId !== null ? 'true' : 'false'}
            onClick={() => this.chooseSeat(this.propsindex, this.props.seat_id, this.props.game_id)}>
            <FontAwesomeIcon
              icon={faChair}
              size='7x'
              color={this.props.seat_id === this.props.playerSeatId ? 'blue' : this.props.is_taken ? 'red' : 'black'} />
          </Button>
        </li>
      );
    }



  }




}

export default Chair