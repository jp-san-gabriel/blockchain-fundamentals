const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { MINING_REWARD, REWARD_INPUT } = require('../config');

class Transaction {
    constructor ({ senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount});
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    createOutputMap ({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        outputMap[recipient] = amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    static validTransaction(transaction) {
        const { input: { address, amount, signature }, outputMap } = transaction;

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount);

        if (amount !== outputTotal) {
            console.error(`Invalid transaction from ${address}`);
            return false;
        }

        if (!verifySignature({
            publicKey: address,
            data: outputMap,
            signature
        })) {
            console.error(`Invalid signature from ${address}`);
            return false;
        }
        return true;
    }

    update({ senderWallet, recipient, amount }) {
        if (this.outputMap[senderWallet.publicKey] < amount)
            throw new Error('Amount exceeds balance');

        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] += amount;
        }

        this.outputMap[senderWallet.publicKey] -= amount;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    static rewardTransaction({ minerWallet }) {
        return new this({
            input: REWARD_INPUT,
            outputMap: {
                [minerWallet.publicKey]: MINING_REWARD
            }
        });
    }
}

module.exports = Transaction;