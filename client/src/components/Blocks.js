import React, { Component } from 'react';
import Block from './Block';
import { Link } from 'react-router-dom';

class Blocks extends Component {
    state = { blocks: [] }

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {
        const { blocks } = this.state;

        return (
            <div>
                <div><Link to='/'>Home</Link></div>
                <h3>Blocks</h3>
                {
                    blocks.map(block => (
                        <Block key={block.hash} block={block}/>
                    ))
                }
            </div>
        )
    }
}

export default Blocks;