import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

import IndexCard from './assets/index-card.svg'





class MyVerticallyCenteredModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      show: true,
      showModal: true,
      activeIndex: 0,
      settingSeat: false,
      selectedSeat: null,
    }

    // bind any handlers in the constructor
    this.teamOneChange = this.teamOneChange.bind(this);
    this.teamTwoChange = this.teamTwoChange.bind(this);
    this.setTeamOneName = this.setTeamOneName.bind(this);
    this.setTeam2Name = this.setTeam2Name.bind(this);
    this.setTeamNames = this.setTeamNames.bind(this);
    this.selectSeat = this.selectSeat.bind(this);
  }
  async setTeamNames() {
    await this.setTeamOneName();
    await this.setTeam2Name();
    this.props.onHide();
    this.setState({ show: false });
    this.setState({ showModal: false });
  }

  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ team2Name: event.target.value });
  }

  async setTeamOneName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    const response = await fetch('/api/set-team-name', requestOptions);
    const json = await response.json();
    console.log(requestOptions);
    console.log(json);
  }

  async setTeam2Name() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.team2Name,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }

  async selectSeat(seatNumber, isTeamOne) {
    this.setState({ settingSeat: true });
    

  }

  render() {
    return (
      <div
        style={{ backgroundImage: `url(${IndexCard})` }}
      >
        <Modal
          show={this.props.show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.state.modalStatus === 0 ? 'Choose a seat' : 'Enter display name'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Carousel
              activeIndex={this.state.activeIndex}
            >
              <Carousel.Item>
                <Container fluid>
                  <Row>
                    <form>
                      <label>
                        Team One Name: <input type="text" onChange={this.teamOneChange} name="teamOneName" />
                        <br />
                        Team Two Name: <input type="text" onChange={this.teamTwoChange} name="team2Name" />
                      </label>
                    </form>
                  </Row>
                  <Row>
                    <Col lg={false}>
                      Team 1 Seats
                      <br></br>
                      {[...Array(3).keys()].map(i => {
                        return (
                          <div key={i}>
                            <Button
                              active={!this.state.settingSeat}
                              onClick={() => this.props.setSeatId(i, true)}
                            >
                              Player {i + 1}
                            </Button>
                            <br></br>
                          </div>

                        );
                      })}
                      <Button>Player 1</Button>
                      <br></br>
                      <Button>Player 2</Button>
                      <br></br>
                      <Button>Player 3</Button>
                    </Col>
                    <Col lg={false}>
                      Team 2 Seats
                        <br></br>
                      {[...Array(3).keys()].map(i => {
                        return (
                          <div>
                            <Button
                              onClick={() => this.props.setSeatId(i, false)}
                            >
                              Player {i + 1}
                            </Button>
                            <br></br>
                          </div>

                        );
                      })}
                      <Button>Player 1</Button>
                      <br></br>
                      <Button>Player 2</Button>
                      <br></br>
                      <Button>Player 3</Button>
                    </Col>
                  </Row>
                </Container>
              </Carousel.Item>
              <Carousel.Item>
                <div>
                  second page
              </div>
              </Carousel.Item>
            </Carousel>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setTeamNames}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>

    );
  }
}

class Controls extends Component {
  constructor() {
    super();
    this.state = {
      disabled: false,
      teamOneName: '',
      team2Name: '',
      facilitatorId: '',
      modalShow: true,
    };
  }

  teamOneChange(event) {
    this.setState({ teamOneName: event.target.value });
  }

  teamTwoChange(event) {
    this.setState({ team2Name: event.target.value });
  }


  async setTeamOneName() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.teamOneName,
        teamId: this.props.team1,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }

  async setTeam2Name() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: this.state.team2Name,
        teamId: this.props.team2,
        facilitatorId: this.props.facilitatorId,
      })
    };
    await fetch('/api/set-team-name', requestOptions);
  }

  render() {

    let modalClose = () => this.setState({ modalShow: false });
    return (
      <div>

        <MyVerticallyCenteredModal
          facilitatorId={this.props.facilitatorId}
          team1={this.props.team1}
          team2={this.props.team2}
          show={this.state.modalShow}
          onHide={modalClose}
        />

      </div>
    )
  }
}

export default Controls
