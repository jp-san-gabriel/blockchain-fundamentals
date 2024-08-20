const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const minedBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(minedBlock);
    }
}

module.exports = Blockchain;