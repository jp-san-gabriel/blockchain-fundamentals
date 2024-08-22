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
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const lastDifficulty = chain[i - 1].difficulty;

            if (lastHash !== chain[i - 1].hash)
                return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash != validatedHash) return false;

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }

    replaceChain(chain) {

        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        console.log('replacing chain with', chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;