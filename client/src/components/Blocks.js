import React, { Component } from 'react';

class Blocks extends Component {
    state = { blocks: [] }

    componentDidMount() {
        fetch('http://localhost:3000/api/blocks')
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {
        const { blocks } = this.state;

        return (
            <div>
                <ol>
                    {blocks.map(block => (
                        <li key={block.hash}>
                            hash: {block.hash} <br/>
                            last hash: {block.lastHash} <br/>
                            nonce: {block.nonce} <br/>
                            timestamp: {block.timestamp}
                        </li>
                    ))}
                </ol>
            </div>
        )
    }
}

export default Blocks;