const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, data, previousHash = ''){
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        const startingTimestamp = Date.now();
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        const endingTime = Date.now();
        console.log('Block mined: ' + this.hash, 'Time taken : ' + (endingTime - startingTimestamp));
    }
}

class BlockChain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block("01/01/2017", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 0; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i -1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            return true;
        }
    }
}

let simpleCoin = new BlockChain();
console.log('Mining block 1...');
simpleCoin.addBlock(new Block(new Date(), { amount : 4 }));

console.log('Mining block 2...');
simpleCoin.addBlock(new Block(new Date(), { amount : 4 }));
