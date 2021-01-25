import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as EnvOk } from './assets/envelope_ok.svg';
import { ReactComponent as EnvBugged } from './assets/envelope_bugged.svg';
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
      activeChangedTeam1: new Array(props.envelopes.length).fill(false),
      activeChangedTeam2: new Array(props.envelopes.length).fill(false),
      selectedTeam1Id: null,
      selectedTeam2Id: null,
      team2Batch: null
    };
    this.getSeats = this.getSeats.bind(this);
    this.emptySeat = this.emptySeat.bind(this);
    this.setActiveTeam1 = this.setActiveTeam1.bind(this);
    this.setActiveTeam2 = this.setActiveTeam2.bind(this);
    this.setBuggedEnvelopes = this.setBuggedEnvelopes.bind(this);
    this.toggleBugModal = this.toggleBugModal.bind(this);
    this.enableDebug = this.enableDebug.bind(this);
    this.resetEnvelopes = this.resetEnvelopes.bind(this);
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
  toggleBugModal() {
    this.setState({buggedEnvelopeModal: !this.state.buggedEnvelopeModal});
  }

  async setBuggedEnvelopes() {
    let selection = []
    let movedEnvelopes = []
    for (let i = 0; i < this.state.team2Batch.length; i++) {
      movedEnvelopes.push(this.state.team2Batch[i]);
    }
    movedEnvelopes.push(this.state.selectedTeam1Id);
    selection.push(this.state.selectedTeam1Id);
    for (let i = 0; i < this.state.selectedTeam2Id.length; i++) {
      selection.push(this.state.selectedTeam2Id[i]);
    }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          envelopes: selection,
        })
      };
    fetch('/api/set-changed', requestOptions);
    this.resetEnvelopes(movedEnvelopes);
    this.props.checkFinishedEnvelopes();
    //move-envelope(selection)
    // skeleton for after other ticket is finished
  }

  resetEnvelopes(envelopes) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        envelopes: envelopes,
        gameId: this.props.gameId,
        teamId: this.props.teamId,
        nextSeat: 0
      })
    };
    fetch('/api/move-envelope', requestOptions);
  }

  setActiveTeam1(index, envelopeId) {
    let s = this.state.activeChangedTeam1;
    for (let i = 0; i < this.state.activeChangedTeam1.length; i++) {
      if (i === index) {
        s[i] = true;
      } else {
        s[i] = false;
      }
    }
    this.setState({activeChangedTeam1: s})
    this.setState({selectedTeam1Id: envelopeId})
  }

  setActiveTeam2(index, envelopeSlice, offset) {
    const selectedIndex = index - offset;
    let idArray = []; 
    let selectedTeam2 = [];
    selectedTeam2.push(envelopeSlice[selectedIndex].envelopeId);
    for (let i = 0; i < envelopeSlice.length; i++) {
      idArray.push(envelopeSlice[i].envelopeId);
    }
    let s = this.state.activeChangedTeam2;
    for (let i = 0; i < this.state.activeChangedTeam2.length; i++) {
      if (i === index) {
        s[i] = true;
      } else {
        s[i] = false;
      }
    }
    this.setState({activeChangedTeam2: s})
    this.setState({team2Batch: idArray})
    this.setState({selectedTeam2Id: selectedTeam2})
  }
  async enableDebug(){
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
              onClick={() => this.emptySeat(s.seatId, idx)}
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
    // can change this batch size if needed
    let batchSize = 5;
    // filter to find finished envelopes (seat number = 3)
    let team1Envelopes = this.props.envelopes.filter(item => item.isTeam1 === true);
    team1Envelopes = team1Envelopes.filter(seatFilter => seatFilter.seatNumber === 3);
    let team2Envelopes = this.props.envelopes.filter(item => item.isTeam1 === false);
    team2Envelopes = team2Envelopes.filter(seatFilter => seatFilter.seatNumber === 3);
    let batch = team2Envelopes.filter((e, i) => team2Envelopes.findIndex(a => a.groupNumber === e.groupNumber) === i);
    return (
      <div class="modal-dialog">
        <div class="modal-content">
        <Row className="justify-content-md-center">
            <Button
              onClick={this.toggleBugModal}
              variant="primary"
            >
                Create Bug in Envelopes
            </Button>
            <Modal show={this.state.buggedEnvelopeModal} onHide={this.toggleBugModal} dialogClassName="modal-90w">
            <Modal.Header closeButton>
              <Modal.Title>Select which envelope to change</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="justify-content-md-center">
              {team1Envelopes.length >= 1 && <Col md="auto">
                <dt>Flow Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                  {team1Envelopes.slice(0, batchSize).map((list, index) =>
                  <li>
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam1(index, team1Envelopes[index].envelopeId)}
                    >
                      <div style={{color: "black"}}>
                        {this.state.activeChangedTeam1[index]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                  )}
                </ul> 
              </Col>
              }
              {team1Envelopes.length > 5 && <Col md="auto">
                <dt>Flow Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                  {team1Envelopes.slice(batchSize, batchSize * 2).map((list, index) =>
                  <li>
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam1(index + (batchSize * 2), team1Envelopes[index + (batchSize * 2)].envelopeId)}
                    >
                      <div style={{color: "black"}}>
                        {this.state.activeChangedTeam1[index + (batchSize * 2)]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + batchSize + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                  )}
                </ul> 
              </Col>
              }
              {team1Envelopes.length > 10 && <Col md="auto">
                <dt>Flow Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                  {team1Envelopes.slice(batchSize * 2, batchSize * 3).map((list, index) =>
                  <li>
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam1(index + (batchSize * 3), team1Envelopes[index + (batchSize * 3)].envelopeId)}
                    >
                      <div style={{color: "black"}}>
                        {this.state.activeChangedTeam1[index + (batchSize * 3)]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + (batchSize * 2) + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                  )}
                </ul> 
              </Col>
              }
              {team1Envelopes.length > 15 && <Col md="auto">
                <dt>Flow Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                  {team1Envelopes.slice(batchSize * 3, batchSize * 4).map((list, index) =>
                  <li>
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam1(index + (batchSize * 4))}
                    >
                      <div style={{color: "black"}}>
                        {this.state.activeChangedTeam1[index + (batchSize * 4)]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index (batchSize * 3) + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                  )}
                </ul> 
              </Col>
              }
              {batch.length >= 1 && <Col md="auto">
                <dt>Batch Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                {team2Envelopes.slice(0, batchSize).map((list, index) =>
                  <li>
                    {index % 5 === 0 && 
                    <h5>Batch {list.groupNumber}</h5>
                    }
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam2(index, team2Envelopes.slice(0, batchSize), batchSize * 0)}
                    >
                      <div style={{color: "black"}}>
                      {this.state.activeChangedTeam2[index]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                )}
                </ul>
              </Col>
              }
              {batch.length >= 2 && <Col md="auto">
                <dt>Batch Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                {team2Envelopes.slice(batchSize * 1, batchSize * 2).map((list, index) =>
                  <li>
                    {index % 5 === 0 && 
                    <h5>Batch {list.groupNumber}</h5>
                    }
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam2(index + batchSize, team2Envelopes.slice(batchSize * 1, batchSize * 2), batchSize * 1)}
                    >
                      <div style={{color: "black"}}>
                      {this.state.activeChangedTeam2[index + batchSize]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                )}
                </ul>
              </Col>
              }
              {batch.length >= 3 && <Col md="auto">
                <dt>Batch Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                {team2Envelopes.slice(batchSize * 2, batchSize * 3).map((list, index) =>
                  <li>
                    {index % 5 === 0 && 
                    <h5>Batch {list.groupNumber}</h5>
                    }
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam2(index + (batchSize * 2), team2Envelopes.slice(batchSize * 2, batchSize * 3), batchSize * 2)}
                    >
                      <div style={{color: "black"}}>
                      {this.state.activeChangedTeam2[index + (batchSize * 2)]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                )}
                </ul>
              </Col>
              }
              {batch.length >= 4 && <Col md="auto">
                <dt>Batch Envelopes</dt>
                <hr></hr>
                <ul style={{listStyleType: "none"}}>
                {team2Envelopes.slice(batchSize * 3, batchSize * 4).map((list, index) =>
                  <li>
                    {index % 5 === 0 && 
                    <h5>Batch {list.groupNumber}</h5>
                    }
                    <Button
                      style={{ display: "contents" }}
                      onClick={() => this.setActiveTeam2(index + (batchSize * 3), team2Envelopes.slice(batchSize * 3, batchSize * 4), batchSize * 3)}
                    >
                      <div style={{color: "black"}}>
                      {this.state.activeChangedTeam2[index + (batchSize * 3)]  ? 
                          <EnvBugged /> :
                          <EnvOk />
                        }
                        Envelope {index + 1}  
                      </div>
                    </Button>
                    <br/>
                  </li>
                )}
                </ul>
              </Col>
              }
              </Row >
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.toggleBugModal}>
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