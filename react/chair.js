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
      active_envelope: null
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
        this.props.setSeatId(json.seat_id);
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
          </Button>


        </li>
      );
    }



  }




}

export default Chair