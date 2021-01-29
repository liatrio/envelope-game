import React, { Component } from "react";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ReactComponent as EnvOk } from './assets/envelope_ok.svg';
import { ReactComponent as EnvBugged } from './assets/envelope_bugged.svg';

class ModalColumns extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.chunkEnvelopesByBatchSize = this.chunkEnvelopesByBatchSize.bind(this);
    }

    chunkEnvelopesByBatchSize(batchSize, envelopes) {
        return envelopes.reduce((acc, curValue) => {
            if (acc.length !== 0 && acc[acc.length - 1].length < batchSize) {
                return [
                    ...acc.slice(0, -1),
                    [
                        ...acc[acc.length - 1],
                        curValue
                    ]
                ];
            }

            return [
                ...acc,
                [curValue]
            ]
        }, []);
    }

    render() {
        const resultTeam = this.chunkEnvelopesByBatchSize(this.props.batchSize, this.props.teamEnvelopes);
        return (
            resultTeam.map((list, index, newArray) =>
                <Col md="auto">
                    <dt>{this.props.title} {this.props.title === "Batch" && index + 1} Envelopes</dt>
                    <hr></hr>
                    <ul style={{ listStyleType: "none" }}>
                        {newArray[index].map((val, i) =>
                            <li>
                                <Button
                                    style={{ display: "contents" }}
                                    onClick={() => this.props.setActiveTeam(index, newArray[index], i, this.props.batchSize)}
                                >
                                    <div style={{ color: "black" }}>
                                        {this.props.activeChangedTeam[(index * this.props.batchSize) + i] ?
                                            <EnvBugged /> :
                                            <EnvOk />
                                        }
                        {this.props.title === "Batch" && <div>Envelope {i + 1}</div>}
                        {this.props.title === "Flow" && <div>Envelope {(index * this.props.batchSize) + i + 1}</div>}
                                    </div>
                                </Button>
                                <br />
                            </li>
                        )}
                    </ul>
                </Col>
            )
        );
    }
}

export default ModalColumns