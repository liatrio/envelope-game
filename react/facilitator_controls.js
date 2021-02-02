import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TeamNameForm from './team_name';
import ModalColumns from './modalcolumns';

class FacilitatorControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatRemoveDisable: new Array(props.seats.length).fill(false),
      buggedEnvelopeModal: false,
      selectionError: false,
      facilitatorSelectedEnvelopes: new Array(props.envelopes.length).fill(false),
      selectedTeam1Id: null,
      selectedTeam2Id: null,
      team2Batch: null,
      batchSize: 5
    };
    this.getSeats = this.getSeats.bind(this);
    this.emptySeat = this.emptySeat.bind(this);
    this.setSelectedEnvelope = this.setSelectedEnvelope.bind(this);
    this.setBuggedEnvelopes = this.setBuggedEnvelopes.bind(this);
    this.toggleBugModal = this.toggleBugModal.bind(this);
    this.setSelectionError = this.setSelectionError.bind(this);
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
    if (this.state.selectedTeam1Id && this.state.selectedTeam2Id) {
      this.setState({selectionError: false});
    }
    const movedEnvelopes = [...this.state.team2Batch, this.state.selectedTeam1Id];
    const changedEnvelopes = [this.state.selectedTeam1Id, this.state.selectedTeam2Id];
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          envelopes: changedEnvelopes,
        })
      };
    await fetch('/api/set-changed', requestOptions);
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
    const resetSelectedArray = [...this.state.facilitatorSelectedEnvelopes].fill(false);
    this.setState({selectedTeam1Id: null,
      selectedTeam2Id: null,
      team2Batch: null,
      facilitatorSelectedEnvelopes: resetSelectedArray,
    });
  }

  setSelectedEnvelope(index, envelopeSlice, envelopeSliceIndex, batchSize) {
    const isTeam1 = envelopeSlice[0].isTeam1;
    const selectedEnv = this.state.facilitatorSelectedEnvelopes;
    const selectedIndex = (isTeam1 ? index * batchSize + envelopeSliceIndex : index * batchSize + envelopeSliceIndex + selectedEnv.length / 2);
    const teamSliceLength = (isTeam1 ? selectedEnv.length / 2 : selectedEnv.length);
    let i = (isTeam1 ? 0 : (selectedEnv.length / 2));
    for (; i < teamSliceLength; i++) {
      if (i === selectedIndex) {
        selectedEnv[i] = true;
      } else {
        selectedEnv[i] = false;
      }
    }
    if (isTeam1) {
      this.setState({facilitatorSelectedEnvelopes: selectedEnv, selectedTeam1Id: envelopeSlice[envelopeSliceIndex].envelopeId})
    } else {
      const idArray = [...Array.from(envelopeSlice, o => o.envelopeId)];
      this.setState({facilitatorSelectedEnvelopes: selectedEnv, team2Batch: idArray, selectedTeam2Id: envelopeSlice[envelopeSliceIndex].envelopeId})
    }
  }

  async enableDebug(){
    await fetch('/api/fill-seats/'); 
  }

  setSelectionError(arg) {
    this.setState({selectionError: arg });
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
    const filterTeam1 = (isTeam1) => (item) => item.isTeam1 === isTeam1;
    const seat3Filter = (item) => item.seatNumber === 3;
    const {envelopes} = this.props;
    const team1Envelopes = envelopes.filter(filterTeam1(true)).filter(seat3Filter);
    const team2Envelopes = envelopes.filter(filterTeam1(false)).filter(seat3Filter);
    return (
      <div className="modal-dialog">
        <div className="modal-content">
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
              <Row>
                <Col className="justify-content-md-center" style={{textAlign: "center", fontWeight: "bold"}}>Flow
                </Col>
                <Col className="justify-content-md-center" style={{textAlign: "center", fontWeight: "bold"}}>Batch
                </Col>
              </Row>
              <Container fluid style={{textAlign: 'justify'}}>
                <Row className="justify-content-md-center">
                    <ModalColumns
                    teamEnvelopes={team1Envelopes}
                    batchSize={this.state.batchSize}
                    setActiveTeam={this.setSelectedEnvelope}
                    facilitatorSelectedEnvelopes={this.state.facilitatorSelectedEnvelopes.slice(0, envelopes.length / 2)}
                    title={"Flow"}
                    />
                    <div style={{borderLeft: '6px solid black', height: '500px'}}></div>
                    <ModalColumns
                    teamEnvelopes={team2Envelopes}
                    batchSize={this.state.batchSize}
                    setActiveTeam={this.setSelectedEnvelope}
                    facilitatorSelectedEnvelopes={this.state.facilitatorSelectedEnvelopes.slice(envelopes.length / 2, envelopes.length)}
                    title={"Batch"}
                    />
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.toggleBugModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.state.selectedTeam1Id && this.state.selectedTeam2Id ? this.setBuggedEnvelopes : () => this.setSelectionError(true)}>
                Submit Changes
              </Button>
              <Modal show={this.state.selectionError} onHide={() => this.setSelectionError(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Selection Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="justify-content-md-center">
                    Please select one envelope from Flow and Batch
                  </Row>
                </Modal.Body>
              </Modal>
            </Modal.Footer>
          </Modal>
        </Row>
        </div>
        <div class="modal-header">
          
          <Row className="justify-content-md-center">
            <h5>Update Team Names</h5>
          </Row>
        </div>
        <div className="modal-content">
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
        <div className="modal-content">
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