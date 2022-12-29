import React from 'react';
import { DiagramWidget, DiagramModel, LinkModel, BlockNodeModel } from '@projectstorm/react-diagrams';
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
    return new Block('Genesis block', '0');
  }

  // The getLatestBlock function returns the latest block in the chain.
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // The addBlock function adds a new block to the chain.
  addBlock(newBlock) {
    // Mine the new block.
    newBlock.mineBlock(DIFFICULTY);
    // Set the new block's previous hash to the hash of the latest block in the chain.
    newBlock.previousHash = this.getLatestBlock().hash;
    // Add the new block to the chain.
    this.chain.push(newBlock);
  }
}

// Create a new blockchain
const blockchain = new Blockchain();

// Define the App component
class App extends React.Component {
  // The constructor function is called whenever a new App instance is created.
  // It initializes the state of the component with the blocks from the blockchain, an empty string for the current block data,
  // and a diagram model to store the block nodes and links.
  constructor(props) {
    super(props);
    this.state = {
      blocks: blockchain.chain,
      currentBlockData: '',
      model: new DiagramModel()
    };
  }

  // The handleChange function updates the currentBlockData property in the component's state with the value of the input field.
  handleChange(event) {
    this.setState({ currentBlockData: event.target.value });
  }

  // The handleSubmit function is called when the form is submitted.
  // It prevents the default refresh of the page and adds a new block to the blockchain with the data from the input field.
  // It then updates the blocks property in the component's state with the updated chain and adds the new block node and link to the diagram model.
  handleSubmit(event) {
    event.preventDefault();
    // Create a new block with the data from the input field and the hash of the previous block.
    const newBlock = new Block(this.state.currentBlockData, this.state.blocks[this.state.blocks.length - 1].hash);
    // Add the new block to the blockchain.
    blockchain.addBlock(newBlock);
    // Update the blocks property in the component's state with the updated chain.
    this.setState({ blocks: blockchain.chain });
    // Add the new block node and link to the diagram model.
    this.state.model.addNode(new BlockNodeModel(newBlock.data, newBlock.hash, this.state.blocks.length - 1));
    this.state.model.addLink(new LinkModel());
    // Clear the input field.
    this.setState({ currentBlockData: '' });
  }

  // The render function is called whenever the component's state or props change.
  // It returns the JSX to render.
  render() {
    // Create an array of block nodes and links for the diagram model.
    const nodes = [];
    const links = [];
    for (let i = 0; i < this.state.blocks.length; i++) {
      const block = this.state.blocks[i];
      nodes.push(new BlockNodeModel(block.data, block.hash, i));
      if (i > 0) {
        links.push(new LinkModel());
      }
    }
    // Add the block nodes and links to the diagram model.
    this.state.model.addAll(nodes, links);

    // Return the JSX to render.
    return (
      <div className="app">
        <h1>Blockchain</h1>
        <form onSubmit={event => this.handleSubmit(event)}>
          <input type="text" value={this.state.currentBlockData} onChange={event => this.handleChange(event)} />
          <button type="submit">Add block</button>
        </form>
        <DiagramWidget model={this.state.model} className="diagram" />
      </div>
    );
  }
}

export default App;
