const uuid = require('uuid/v1');

class Transaction {
    constructor ({ senderWallet, recipient, amount }) {
        this.id = uuid();
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount});
    }

    createOutputMap ({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        outputMap[recipient] = amount;

        return outputMap;
    }
}

module.exports = Transaction;