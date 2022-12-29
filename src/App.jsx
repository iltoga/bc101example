import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';

// Set the difficulty level
const DIFFICULTY = 2;

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
    const hash = SHA256(this.data + this.previousHash + this.timestamp + this.nonce).toString();
    console.log(`Hash calculation: SHA256("${this.data}" + "${this.previousHash}" + "${this.timestamp}" + "${this.nonce}") = ${hash}`);
    return hash;
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

  verifyNonce(block) {
    // Verify the nonce of the block
    if (block.nonce !== this.calculateNonce(block)) {
      return false;
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

  // The handleHashChange function updates the hashToVerify property in the component's state with the value of the input field.
  handleChange = (event) => {
    this.setState({ currentBlockData: event.target.value });
  }

  // The handleSubmit function is called when the form is submitted.
  // It prevents the default refresh of the page and adds a new block to the blockchain with the data from the input field.
  // It then updates the blocks property in the component's state with the updated chain.
  handleSubmit = (event) => {
    event.preventDefault();
    const newBlock = new Block(this.state.currentBlockData, this.state.blocks[this.state.blocks.length - 1].hash);
    blockchain.addBlock(newBlock);
    this.setState({
      blocks: blockchain.chain,
      currentBlockData: ''
    });
  }

  // The render function is called whenever the component's state or props are updated.
  // It returns the JSX code that will be rendered to the DOM.

  render = () => {
    const blocks = this.state.blocks;
    return (
      <div className="section">
        <h1>Blockchain Demo</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Data:
            <input type="text" value={this.state.currentBlockData} onChange={this.handleChange} />
          </label>
          <button type="submit">Add block</button>
        </form>
        <form onSubmit={this.verifyHash}>
          <label>
            Block number:
            <input type="number" value={this.state.currentBlockNumber} onChange={this.handleBlockNumberChange} />
          </label>
          <label>
            Hash to verify:
            <input type="text" value={this.state.currentHashToVerify} onChange={this.handleHashChange} />
          </label>
          <label>
            Nonce:
            <input type="text" value={this.state.currentNonce} onChange={this.handleNonceChange} />
          </label>
          <button type="submit">Verify</button>
        </form>
        <h2>Proof-of-Work (PoW)</h2>
          <p>
            In a blockchain that uses PoW, each block contains a hash that is calculated using the data in the block, the previous block's hash, the timestamp, and a nonce.
            In order to "mine" a block, the miner must find a nonce that results in a hash that meets the difficulty requirement.
            This process involves repeatedly calculating the hash and incrementing the nonce until the correct nonce is found.
            The difficulty requirement is typically a specific number of leading zeros in the hash, which means that the hash must be a very small number in order to meet the requirement.
            The hash calculation for each block can be represented as follows:
            SHA256(block data + previousHash + block timestamp + nonce) = block hash
          </p>
        <h2>Blocks</h2>
        <table>
          <thead>
            <tr>
              <th>Block number</th>
              <th>Data</th>
              <th>Timestamp</th>
              <th>Previous hash</th>
              <th>Hash</th>
              <th>Nonce</th>
            </tr>
          </thead>
          <tbody>
            {this.state.blocks.map((block, index) =>
              <React.Fragment>
                <tr key={index}>
                  <td rowSpan={2}>{index}</td>
                  <td></td>
                  <td>{block.timestamp}</td>
                  <td>{block.previousHash}</td>
                  <td>{block.hash}</td>
                  <td>{block.nonce}</td>
                </tr>
                <tr>
                  <td colSpan="6">{block.data}</td>
                </tr>
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  handleBlockNumberChange = (event) => {
    this.setState({ currentBlockNumber: event.target.value });
  }

  verifyHash = (event) => {
    event.preventDefault();
  
    const blockNumber = this.state.currentBlockNumber;
    const hashToVerify = this.state.currentHashToVerify;
    const nonce = this.state.currentNonce;
  
    const block = this.state.blocks[blockNumber];
    if (!block) {
      console.log("Invalid block number");
      return;
    }
  
    // Calculate the hash of the block using the payload and nonce
    const calculatedHash = SHA256(block.data + block.previousHash + block.timestamp + nonce).toString();
  
    // Compare the calculated hash to the hash to verify
    if (calculatedHash === hashToVerify) {
      console.log("Hash is valid");
    } else {
      console.log("Hash is invalid");
    }
  }
    
}

export default App;

