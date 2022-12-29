import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';

// Set the difficulty level
const DIFFICULTY = 4;

// Define the Block class
class Block {
  // The constructor function is called whenever a new Block instance is created.
  // It initializes the properties of the new block object.
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // The calculateHash function calculates and returns the hash of the block.
  calculateHash() {
    return SHA256(this.data + this.previousHash + this.timestamp + this.nonce).toString();
  }

  // The mineBlock function mines the block, which means it calculates the block's hash until it meets the difficulty requirement.
  mineBlock(difficulty) {
    console.log('Mining block...');

    // Loop until the block's hash meets the difficulty requirement
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      // Increment the nonce and recalculate the hash
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash} (nonce: ${this.nonce})`);
  }
}

// Define the Blockchain class
class Blockchain {
  // The constructor function is called whenever a new Blockchain instance is created.
  // It initializes the chain property with an array containing the genesis block.
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // The createGenesisBlock function creates and returns the genesis block.
  createGenesisBlock() {
    const genesisBlock = new Block('Genesis block', '0');
    return genesisBlock;
  }

  // The getLatestBlock function returns the latest block in the chain.
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // The addBlock function adds a new block to the chain.
  addBlock(newBlock) {
    // if (!this.verifyNonce()) {
    //   console.log("Invalid nonce in previous block");
    //   return;
    // }    
    // Set the new block's previous hash to the hash of the latest block in the chain.
    newBlock.previousHash = this.getLatestBlock().hash;
    // Mine the new block.
    newBlock.mineBlock(DIFFICULTY);
    // Add the new block to the chain.
    this.chain.push(newBlock);
  }
  
  calculateNonce(block) {
    let nonce = 0;
    let hash = block.calculateHash();
    while (hash.substring(0, DIFFICULTY) !== Array(DIFFICULTY + 1).join("0")) {
      nonce++;
      hash = block.calculateHash();
    }
    return nonce;
  }

  verifyNonce() {
    // Verify the nonce of the genesis block
    if (this.chain[0].nonce !== this.calculateNonce(this.chain[0])) {
      return false;
    }

    // Verify the nonce of the other blocks
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      if (currentBlock.nonce !== this.calculateNonce(currentBlock)) {
        return false;
      }
    }
    return true;
  }

}

// Create a new blockchain
const blockchain = new Blockchain();

// Define the App component
class App extends React.Component {
  // The constructor function is called whenever a new App instance is created.
  // It initializes the state of the component with the blocks from the blockchain and an empty string for the current block data.
  constructor(props) {
    super(props);
    this.state = {
      blocks: blockchain.chain,
      currentBlockData: '',
      hashToVerify: ''
    };
  }

  // The handleChange function updates the currentBlockData property in the component's state with the value of the input field.
  handleChange(event) {
    this.setState({ currentBlockData: event.target.value });
  }

  // The handleHashChange function updates the hashToVerify property in the component's state with the value of the input field.
  handleHashChange(event) {
    this.setState({ hashToVerify: event.target.value });
  }

  // The handleSubmit function is called when the form is submitted.
  // It prevents the default refresh of the page and adds a new block to the blockchain with the data from the input field.
  // It then updates the blocks property in the component's state with the updated chain.
  handleSubmit(event) {
    event.preventDefault();
    const newBlock = new Block(this.state.currentBlockData, this.state.blocks[this.state.blocks.length - 1].hash);
    blockchain.addBlock(newBlock);
    this.setState({
      blocks: blockchain.chain,
      currentBlockData: ''
    });
  }



  // The verifyHash function is called when the form is submitted.
  // It prevents the default refresh of the page and verifies the hash of the latest block in the chain with the value from the input field.
  // If the hash is valid, it logs a message to the console. If the hash is invalid, it logs an error message to the console.
  verifyHash(event) {
    event.preventDefault();
    const latestBlock = this.state.blocks[this.state.blocks.length - 1];
    if (latestBlock.hash === this.state.hashToVerify) {
      console.log("Valid hash");
    } else {
      console.error("Invalid hash");
    }
  }  

  // The render function is called whenever the component's state or props are updated.
  // It returns the JSX code that will be rendered to the DOM.
  render() {
    return (
      <div>
        <h1>Blockchain Demo</h1>
        <form onSubmit={event => this.handleSubmit(event)}>
          <label>
            New block data:
            <input type="text" value={this.state.currentBlockData} onChange={event => this.handleChange(event)} />
          </label>
          <button type="submit">Add block</button>
        </form>
        <h2>Verify hash</h2>
        <form onSubmit={event => this.verifyHash(event)}>
          <label>
            Hash to verify:
            <input type="text" value={this.state.hashToVerify} onChange={event => this.handleHashChange(event)} />
          </label>
          <button type="submit">Verify</button>
        </form>
        <h2>Blockchain</h2>
        <ul>
          {this.state.blocks.map((block, index) =>
            <li key={index}>{block.hash} (nonce: {block.nonce})</li>
          )}
        </ul>
      </div>
    );
  }

}

export default App;

