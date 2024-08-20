const Block = require('./block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const minedBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(minedBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) != JSON.stringify(Block.genesis()))
            return false;
        for (let i = 1; i < chain.length; i ++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash
            const { timestamp, lastHash, hash, data } = block;
            if (lastHash !== actualLastHash)
                return false;
            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if (hash != validatedHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;