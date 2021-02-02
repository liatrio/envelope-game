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
    /*
    Function to split envelopes into a 2d array 
    input: envelopes of either batch or flow team [1, 2, 3, etc]
    output: chunked into batches in 2d array up to batch size at each index [[1, 2, 3, etc], [1, 2, 3, etc]]
    */
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
        const {title, batchSize} = this.props;
        const resultTeam = this.chunkEnvelopesByBatchSize(batchSize, this.props.teamEnvelopes);
        return (
            resultTeam.map((_, index, columns) =>
                <Col md ="auto">
                    <ul style={{ listStyleType: "none" }}>
                        {columns[index].map((_, i) =>
                            <li style={{width: "80.14px", height: "96.08px"}}>
                                <Button
                                    style={{ display: "contents" }}
                                    onClick={() => this.props.setActiveTeam(index, columns[index], i, batchSize)}
                                >
                                    <div style={{ color: "black" }}>
                                        {this.props.facilitatorSelectedEnvelopes[(index * batchSize) + i] ?
                                            <EnvBugged /> :
                                            <EnvOk />
                                        }
                        {title === "Batch" && <div>Envelope {i + 1}</div>}
                        {title === "Flow" && <div>Envelope {(index * batchSize) + i + 1}</div>}
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