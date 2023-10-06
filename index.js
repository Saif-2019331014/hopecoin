import sha256 from "crypto-js/sha256.js";

class Block {
  constructor(timestamp, data, previousHash = "0000") {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.timestamp + JSON.stringify(this.data) + this.previousHash
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
  }

  generateGenesisBlock() {
    return new Block("2000-02-19", {itemType: 'initial block', name: 'GENESIS BLOCK', price: '$0'}, '0000')
  }

  getCurrentLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  appendBlock(newBlock) {
    newBlock.previousHash = this.getCurrentLastBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

const hopecoin = new Blockchain();
const block = new Block(new Date().toUTCString(), {
  itemType: "book",
  name: "Blockchain 101",
  price: "$10",
});

hopecoin.appendBlock(block);
console.log(hopecoin);
