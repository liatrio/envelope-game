import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair } from '@fortawesome/free-solid-svg-icons'
import { faSquareFull } from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ToggleButton from 'react-bootstrap/ToggleButton'
import './index.css'
class Chairs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatID: '',
    }
  }
  async chooseSeat(index, seat_id, gameID) {
    if (!this.state.seatID) {
      const response = await fetch(`/api/choose-seat/${gameID}/${seat_id}`)
      const json = await response.json();
      console.log(json);
      console.log(this.state.seatID);
      this.setState({ seatID: seat_id });
    }
    // api/chooseSeat/gameID/seatID
  }

  render() {
    var team1Chairs = []
    var team2Chairs = []
    //var workArea = []
    var chairs = this.props.seats;
    const gameID = this.props.gameID;
    chairs.forEach((c, index) => {
      if (c.is_team_1) {
        team1Chairs.push(<li><ToggleButton className={c.is_taken ? "chairFilled" : "chairNotFilled"} type="radio" variant="secondary" active={c.is_taken ? 'true' : 'false'} onClick={() => this.chooseSeat(index, c.seat_id, gameID)}>
          <FontAwesomeIcon icon={faChair} size='7x' color={c.seat_id === this.state.seatID ? 'blue' : c.is_taken ? 'red' : 'black'} />
        </ToggleButton> <FontAwesomeIcon icon={faSquareFull} size='7x' color='brown' /></li>);
      }
      else {
        team2Chairs.push(<li><FontAwesomeIcon icon={faSquareFull} size='7x' color='brown' />
          <ToggleButton className={c.is_taken ? "chairFilled" : "chairNotFilled"} type="radio" variant="secondary" active={c.is_taken ? 'true' : 'false'} onClick={() => this.chooseSeat(index, c.seat_id, gameID)}>
            <FontAwesomeIcon icon={faChair} size='7x' color={c.seat_id === this.state.seatID ? 'blue' : c.is_taken ? 'red' : 'black'} />
          </ToggleButton></li>);
      }
      //workArea.push()  
    });
    return (
      <div>
        <Container>
          <Row>
            <Col><ul className="chairColumn">{team1Chairs}</ul></Col>
            <Col><ul className="chairColumn">{team2Chairs}</ul></Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Chairs;