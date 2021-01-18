import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as EnvOk } from './assets/envelope_ok.svg';
import { ReactComponent as EnvClosed } from './assets/envelope_closed.svg';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import TeamNameForm from './team_name';

class FacilitatorControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatRemoveDisable: new Array(props.seats.length).fill(false),
      buggedEnvelopeModal: false,
      activeChangedEnvelope: new Array(props.envelopes.length).fill(false),
    };
    this.getSeats = this.getSeats.bind(this);
    this.emptySeat = this.emptySeat.bind(this);
    this.setBuggedEnvelopes = this.setBuggedEnvelopes.bind(this);
    this.setActive = this.setActive.bind(this);
    this.enableDebug = this.enableDebug.bind(this);
  }

  async emptySeat(seatId, idx) {
    let s = this.state.seatRemoveDisable;
    s[idx] = true;
    this.setState({ seatRemoveDisable: s });
    await fetch(`/api/remove-player/${seatId}`);
    s = this.state.seatRemoveDisable;
    s[idx] = false;
    this.setState({ seatRemoveDisable: s });
  }
  setBuggedEnvelopes() {
    console.log("in bug")
    this.setState({buggedEnvelopeModal: !this.state.buggedEnvelopeModal});
  }

  setActive(index) {
    // let array = new Array(this.state.activeChangedEnvelope.length).fill(false);
    // console.log("in");
    // this.setState({activeChangedEnvelope: array});
    // console.log("after first setstate");
    let s = this.state.activeChangedEnvelope;
    for (let i = 0; i < this.state.activeChangedEnvelope.length; i++) {
      if (i === index) {
        s[i] = true;
      } else {
        s[i] = false;
      }
    }
    //s[index] = true;
    this.setState({activeChangedEnvelope: s})
  }

  async enableDebug(){
    console.log("enableDebug Called.");
    await fetch('/api/fill-seats/');
    
  }

  getSeats(isTeamOne) {
    // if seat information has loaded
    if (this.props.seats.length !== 0) {
      // check if we should dismiss the modal
      return this.props.seats.filter(i => {
        return i.isTeam1 === isTeamOne;
      }).sort((a, b) => {
        return (a.seatNumber > b.seatNumber ? 1 : -1);
      }).map((s, idx) => {
        return (
          <li key={s.seatId}>
            <Button
              className={s.isTaken ? "visible" : "invisible"}
              variant="danger"
              disabled={this.state.seatRemoveDisable[idx] || this.props.isStarted}
              // onClick={() => this.emptySeat(s.seatId, idx)}
            >
              X
            </Button>
            {s.displayName === null ?
              `Player ${s.seatNumber + 1}` :
              s.displayName
            }
            <br></br>
            <br></br>
          </li>
        );
      });
    } else {
      // return placeholder buttons to prevent "pop in"
      return [...Array(3).keys()].map(i => {
        return (
          <li key={i}>
            <Button
              disabled={true}
              className="invisible"
            >Player 0</Button>
          </li>
        );
      });
    }
  }

  render() {
    let team1Envelopes = this.props.envelopes.filter(item => item.isTeam1 === true);
    team1Envelopes = team1Envelopes.filter(seatFilter => seatFilter.seatNumber === 3);
    //this.setState({activeChangedEnvelope: array})
    let team2Envelopes = this.props.envelopes.filter(item => item.isTeam1 === false);
    team2Envelopes = team2Envelopes.filter(seatFilter => seatFilter.seatNumber === 3);
    return (
      <div class="modal-dialog">
        <div class="modal-content">
        <Row className="justify-content-md-center">
            <Button
              onClick={this.setBuggedEnvelopes}
              variant="primary"
            >
                Create Bug in Envelopes
            </Button>
            <Modal show={this.state.buggedEnvelopeModal} onHide={this.setBuggedEnvelopes}>
            <Modal.Header closeButton>
              <Modal.Title>Select which envelope to change</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="justify-content-md-center">
              <Col md="auto">
                <dt>Flow Envelopes</dt>
                <hr></hr>
                <ul>
                  {team1Envelopes.map((list, index) =>
                  <li>
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActive(index)}
                    >
                      <div style={{color: "black"}}>
                        {this.state.activeChangedEnvelope[index]  ? 
                          <EnvOk /> :
                          <EnvClosed />
                        }
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                  )}
                </ul> 
              </Col>
              <Col md="auto">
                <dt>Batch Envelopes</dt>
                <hr></hr>
                <ul>
                {team2Envelopes.map((list, index) =>
                  <li>
                    <Button
                      style={{ display: "contents" }}
                    >
                      <div style={{color: "black"}}>
                        <EnvOk />
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                )}
                </ul>
              </Col>
              </Row >
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.setBuggedEnvelopes}>
                Close
              </Button>
              <Button variant="primary" onClick={this.setBuggedEnvelopes}>
                Submit Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
        </div>
        <div class="modal-header">
          
          <Row className="justify-content-md-center">
            <h5>Update Team Names</h5>
          </Row>
        </div>
        <div class="modal-content">
          <Button
            disabled = {false}
            onClick={() => this.enableDebug()} 
          >Debug Button</Button>
          <br></br>
          <Row className="justify-content-md-center">
            <Col>
              <TeamNameForm
                team1={this.props.team1}
                team2={this.props.team2}
                facilitatorId={this.props.facilitatorId}
                toggleControls={this.props.toggleControls}
              />
            </Col>
          </Row>
        </div>
        <div class="modal-header">
          <Row className="justify-content-md-center">
            <h5>Remove players</h5>
          </Row>
        </div>
        <div class="modal-content">
          <br></br>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <dt>Flow Players</dt>
              <hr></hr>
              <ul className="chairColumn list-unstyled">
                {this.getSeats(true)}
              </ul>
            </Col>
            <Col md="auto">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                variant="primary"
                className={this.props.seats.length === 0 ? "visible" : "invisible"}
              />
            </Col>
            <Col md="auto">
              <dt>Batch Players</dt>
              <hr></hr>
              <ul className="chairColumn list-unstyled">
                {this.getSeats(false)}
              </ul>
            </Col>
          </Row >
        </div>
      </div>
    );
  }
}

export default FacilitatorControls