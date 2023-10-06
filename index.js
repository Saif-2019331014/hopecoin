import sha256 from "crypto-js/sha256.js";

class Block {
  constructor(timestamp, transactions, previousHash = "0000") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 29;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    // console.log("Mining done. Hash:" + this.hash);
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  generateGenesisBlock() {
    return new Block(
      "2000-02-19",
      [new Transaction("amarAddress", "tomarAddress", 2000)],
      "0000"
    );
  }

  getCurrentLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  appendTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(minerAddress) {
    const block = new Block(new Date().toUTCString(), this.pendingTransactions);
    block.previousHash = this.getCurrentLastBlock().hash;
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction("System", minerAddress, this.miningReward),
    ];
  }

  getAddressBalance(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (address === transaction.fromAddress) {
          balance -= transaction.amount;
        }

        if (address === transaction.toAddress) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
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
const transaction1 = new Transaction("address1", "address2", 100);
const transaction2 = new Transaction("address2", "address1", 50);
hopecoin.appendTransaction(transaction1);
hopecoin.appendTransaction(transaction2);
hopecoin.minePendingTransactions("Um_ded");
// console.log(hopecoin.getAddressBalance('Um_ded')) /// Reward is in pending transactions
hopecoin.minePendingTransactions("Tum_ded");
// console.log(hopecoin.getAddressBalance('Um_ded')) /// Reward in account because got mined

// console.log(hopecoin.getAddressBalance('amarAddress'))
// console.log(hopecoin.getAddressBalance('tomarAddress'))
// console.log(hopecoin.getAddressBalance('address1'))
// console.log(hopecoin.getAddressBalance('address2'))
console.log(hopecoin);
