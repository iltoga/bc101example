import React from 'react';
import SHA256 from 'crypto-js/sha256';

// Set the difficulty level
const DIFFICULTY = 2;

// Helper fuction to calculate time elapsed
var startTime, endTime;

const startTimer = () => {
  startTime = performance.now();
};

const endTimer = () => {
  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms 
  return timeDiff + " ms";
}

// The computeHash function calculates and returns the hash of the block.
const computeHash = (data, previousHash, timestamp, nonce) => {
  const hash = SHA256(data + previousHash + timestamp + nonce).toString();  
  return hash;
}

const generateRandomPhrase = (length) => {
  // create a list of words to use as the source for the phrases
  var words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'huckleberry',
  'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'peach', 'plum', 'quince',
  'raspberry', 'strawberry', 'tangerine', 'ugli fruit', 'watermelon'];

  // initialize the result as an empty string
  var result = '';

  // choose a random word from the list and add it to the result
  for (var i = 0; i < length; i++) {
    var word = words[Math.floor(Math.random() * words.length)];
    result += word;

    // add a space between words, except for the last one
    if (i < length - 1) {
      result += ' ';
    }
  }

  return result;
}

// Define the Block class
class Block {
  // The constructor function is called whenever a new Block instance is created.
  // It initializes the properties of the new block object.
  constructor(data, previousHash, timestamp) {
    this.data = data;
    this.previousHash = previousHash;
    this.timestamp = timestamp ? timestamp : Date.now();
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // The calculateHash function calculates and returns the hash of the block.
  calculateHash(nonce) {
    if (nonce !== '') {
      this.nonce = nonce;
    }
    let hash = computeHash(this.data, this.previousHash, this.timestamp, this.nonce)
    console.log(`Hash calculation: SHA256("${this.data}" + "${this.previousHash}" + "${this.timestamp}" + "${this.nonce}") = ${hash}`);
    return hash;
  }

  // The mineBlock function mines the block, which means it calculates the block's hash until it meets the difficulty requirement.
  mineBlock(difficulty) {
    console.log('Mining block...');

    startTimer();
    // Loop until the block's hash meets the difficulty requirement
    this.nonce = blockchain.calculateNonce(this, difficulty);
    this.hash = this.calculateHash(this.nonce);

    const output = `Block mined: ${this.hash} (Nonce: ${this.nonce}) Elapsed: ${endTimer()} Difficulty: ${difficulty}`;      
    console.log(output);
    return output;
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
  addBlock(newBlock, difficulty = DIFFICULTY) {
    // Set the new block's previous hash to the hash of the latest block in the chain.
    newBlock.previousHash = this.getLatestBlock().hash;
    // Mine the new block.
    alert(newBlock.mineBlock(difficulty));
    // Add the new block to the chain.
    this.chain.push(newBlock);
  }
  
  calculateNonce(block, difficulty) {
    let nonce = 0;
    let hash = block.calculateHash(nonce);
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      nonce++;
      hash = block.calculateHash(nonce);
    }
    
    block.hash = hash;
    return nonce;
  }

  verifyNonce(block, difficulty) {
    // Verify the nonce of the block
    if (block.nonce !== this.calculateNonce(block, difficulty)) {
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

  simulateMineBlock = () => {
    const data = this.state.data;
    const previousHash = this.state.previousHash;
    const timestamp = this.state.timestamp;
    const difficulty = this.state.difficulty ? this.state.difficulty : DIFFICULTY;
    
    const b = new Block(data, previousHash, timestamp);
    alert(b.mineBlock(difficulty));

  }  

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeNumeric = (event) => {
    this.setState({ [event.target.name]: event.target.value*1 });
  }


  // The handleSubmit function is called when the form is submitted.
  // It prevents the default refresh of the page and adds a new block to the blockchain with the data from the input field.
  // It then updates the blocks property in the component's state with the updated chain.
  handleSubmit = (event) => {
    event.preventDefault();
    const blockData = this.state.currentBlockData === '' ? generateRandomPhrase(20) : this.state.currentBlockData
    const newBlock = new Block(blockData, this.state.blocks[this.state.blocks.length - 1].hash);
    const difficulty = this.state.difficulty ? this.state.difficulty : DIFFICULTY;
    blockchain.addBlock(newBlock, difficulty);
    this.setState({
      blocks: blockchain.chain,
      currentBlockData: ''
    });
  }

  calculateHash = (event) => {
    event.preventDefault();
    const { data, previousHash, timestamp, nonce } = this.state;
    const hash = computeHash(data, previousHash, timestamp, nonce).toString();
    this.setState({ hash });
  }

  // The render function is called whenever the component's state or props are updated.
  // It returns the JSX code that will be rendered to the DOM.
  render = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Blockchain Demo</h1>
        </header>
        <div className="forms-container">
          <form onSubmit={this.handleSubmit}>
            <label>
              Data:
              <input type="text" name="currentBlockData" onChange={this.handleChange} />
            </label>
            <label>
              Difficulty:
              <input type="text" name="difficulty" onChange={this.handleChangeNumeric} />
            </label>
            <button type="submit">Add block</button>
          </form>
          <form onSubmit={this.calculateHash}>
            <label>
              Data:
              <input type="text" name="data" onChange={this.handleChange} />
            </label>
            <label>
              Previous Hash:
              <input type="text" name="previousHash" onChange={this.handleChange} />
            </label>
            <label>
              Timestamp:
              <input type="text" name="timestamp" onChange={this.handleChange} />
            </label>
            <label>
              Nonce:
              <input type="text" name="nonce" onChange={this.handleChange} />
            </label>
            { this.state.hash ? <p className='form-calculatedHash'>{this.state.hash}</p> : <p></p> }
            <button type="submit">Calculate Hash</button>
            <button type="button" onClick={this.simulateMineBlock}>Mine Block</button>
          </form>
          <form onSubmit={this.verifyHash}>
            <label>
              Block number:
              <input type="number" name="currentBlockNumber" onChange={this.handleChange} />
            </label>
            <label>
              Hash to verify:
              <input type="text" name="currentHashToVerify" onChange={this.handleChange} />
            </label>
            <label>
              Nonce:
              <input type="text" name="currentNonce" onChange={this.handleChange} />
            </label>
            <button type="submit">Verify</button>
          </form>
        </div>
        <h2>Proof-of-Work (PoW)</h2>
          <p>
            In a blockchain that uses PoW, each block contains a hash that is calculated using the data in the block, the previous block's hash, the timestamp, and a nonce.
            In order to "mine" a block, the miner must find a nonce that results in a hash that meets the difficulty requirement.
            This process involves repeatedly calculating the hash and incrementing the nonce until the correct nonce is found.
            The difficulty requirement is typically a specific number of leading zeros in the hash, which means that the hash must be a very small number in order to meet the requirement.
            The hash calculation for each block can be represented as follows:
            SHA256(block data + previousHash + block timestamp + nonce) = block hash
          </p>
        <header className="App-header">
          <h1>Blockchain</h1>
        </header>
        <main>
          {/* Map through the blocks in the chain and render them as rectangles */}
              <div className="block-container">
                {this.state.blocks.map((block, index) => {
                  return (
                    <div className="block-rectangle" key={index}>
                      <div>
                        <label>Block N. </label>
                        <span className="block-number">{index}</span>
                      </div>
                      <div>
                        <label>Data:</label>
                        <span className="block-data">{block.data}</span>
                      </div>
                      <div>
                        <label>Timestamp:</label>
                        <span className="block-timestamp">{block.timestamp}</span>
                      </div>
                      <div>
                        <label>Previous hash:</label>
                        <span className="block-previous-hash">{block.previousHash}</span>
                      </div>
                      <div>
                        <label>Nonce:</label>
                        <span className="block-nonce">{block.nonce}</span>
                      </div>
                      <div>
                        <label>Hash:</label>
                        <span className="block-hash">{block.hash}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
        </main>
        <div className='blockdata-container' style={{height: '500px', overflowY: 'scroll'}}>
          <header className="App-header">
            <h1>Blocks</h1>
          </header>
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
      </div>
    );
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
      alert("Hash is valid")
    } else {
      alert("Hash is invalid");
    }
  }
    
}

export default App;

