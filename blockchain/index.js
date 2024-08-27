const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { GENESIS_DATA, REWARD_INPUT, MINING_REWARD } = require('../config');
const { cryptoHash } = require('../util');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const minedBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(minedBlock);
    }

    validTransactionData({ chain }) {
        for (let i = 1; i < chain.length; i ++) {
            const block = chain[i];
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount ++;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.amount != trueBalance) {
                        console.error('Invalid input amount');
                        return false;
                    }
                }
            }
        }
        return true;
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

    replaceChain(chain, onSuccess) {

        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        if (onSuccess) onSuccess();
        console.log('replacing chain with', chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;