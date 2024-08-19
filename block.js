class Block {
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
}

const block1 = new Block({
    timestamp: '18/11/2021', 
    lastHash: 'foo-lastHash', 
    hash: 'foo-hash', 
    data: 'foo-data'
});

console.log('block1', block1);