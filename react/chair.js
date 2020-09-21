import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import { faSquareFull } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Container'
import Envelope from './envelope'
import EnvelopeStack from './envelope_stack'




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
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        display_name: this.state.display_name,
        seat_id: this.state.seat_id,
      })
    };
    console.log("Before set-player-name await");
    const response1 = await fetch('/api/set-player-name', requestOptions);
    const json1 = await response1.json();
    
    console.log(json1);

    if (json1.success) {
      console.log("Display Name was set.");
    }
    else
    {
      console.log("Display Name was not set.")
    }
 
  }
  }


  render() {
    if (this.props.is_team_1) {
      return (
        <div>
          <Row>
            <li key={this.props.seat_id} className="list-unstyled">
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
                <span class="badge">{this.props.display_name}</span>
              </Button>

              <Envelope className={this.state.active_envelope === null ? "invisible" : "visible"}></Envelope>
              <EnvelopeStack stack_type="Finished envelopes" count={0}></EnvelopeStack>

            </li>
          </Row>
        </div>
        

      );
    } else {
      return (
        <li key={this.props.seat_id} className="list-unstyled">
          <EnvelopeStack stack_type="Envelopes to do" count={0}></EnvelopeStack>

          <Button
            className={this.props.is_taken ? "chairFilled" : "chairNotFilled"}
            variant="secondary"
            active={this.props.is_taken || this.props.playerSeatId !== null ? 'true' : 'false'}
            onClick={() => this.chooseSeat(this.propsindex, this.props.seat_id, this.props.game_id)}>
            <FontAwesomeIcon
              icon={faChair}
              size='7x'
              color={this.props.seat_id === this.props.playerSeatId ? 'blue' : this.props.is_taken ? 'red' : 'black'} />
              <span class="badge">{this.props.display_name}</span>
          </Button>

        </li>
      );
    }



  }




}

export default Chair