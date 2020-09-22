import React, { Component } from 'react'
import Button from '@bit/react-bootstrap.react-bootstrap.button'
import Modal from '@bit/react-bootstrap.react-bootstrap.modal'
import ReactBootstrapStyle from '@bit/react-bootstrap.react-bootstrap.internal.style-links';

class ControlsModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

   
    App() {
        const [modalShow, setModalShow] = React.useState(false);

        return (
            <div>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                    Facilitator Controls
            </Button>

                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            </div>
        );
    }
    render() {
        return (
            <>

                <Button variant="primary" onClick={() => setModalShow(true)}>
                    Facilitator Controls
            </Button>



                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Modal heading
              </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>
                                Team One Name: <input type="text" onChange={props.teamOneChange} name="teamOneName" />
                                <input type="button" onClick={props.setTeamOneName} value="Submit" />
                                <br />
                  Team Two Name: <input type="text" onChange={props.teamTwoChange} name="teamTwoName" />
                                <input type="button" onClick={props.setTeamTwoName} value="Submit" />
                            </label>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default () => (<div><ReactBootstrapStyle /> <ControlsModal /></div>)