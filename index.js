import sha256 from "crypto-js/sha256.js";

class Block {
  constructor(timestamp, data, previousHash = "0000") {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return sha256(
      this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++
        this.hash = this.calculateHash()
    }

    console.log('Mining done. Hash:' + this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 4;
  }

  generateGenesisBlock() {
    return new Block(
      "2000-02-19",
      { itemType: "initial block", name: "GENESIS BLOCK", price: "$0" },
      "0000"
    );
  }

  getCurrentLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  appendBlock(newBlock) {
    newBlock.previousHash = this.getCurrentLastBlock().hash;
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock);
  }

  isBlockchainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previousHash !== previousBlock.hash
      ) {
        return false;
      }
    }

    return true;
  }
}

const hopecoin = new Blockchain();
const block1 = new Block(new Date().toUTCString(), {
  itemType: "book",
  name: "Blockchain 101",
  price: "$10"
});
const block2 = new Block(new Date().toUTCString(), {
    itemType: "book",
    name: "How to train your dragon",
    price: "$20"
  });

hopecoin.appendBlock(block1);
hopecoin.appendBlock(block2);
console.log(hopecoin);
