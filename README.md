# Blockchain Demo

This application is a simple implementation of a blockchain using the React JavaScript library and the SHA256 cryptographic hash function from the crypto-js library. It includes a `Block` class that defines a block and a `Blockchain` class that defines a blockchain. 

The `Block` class has a constructor function that initializes the properties of the block, including the data, previous hash, timestamp, nonce, and hash. It also includes a `calculateHash` function that calculates the hash of the block and a `mineBlock` function that mines the block by repeatedly calculating the block's hash until it meets the difficulty requirement. The `Blockchain` class has a constructor function that initializes the chain property with an array containing the genesis block. It also includes a `createGenesisBlock` function that creates and returns the genesis block and a `getLatestBlock` function that returns the latest block in the chain.

The `DIFFICULTY` variable is set to 2 and the `computeHash`, `generateRandomPhrase`, `startTimer` and `endTimer` are helper functions.

The code also includes a `console.log` statements for debugging and understanding the flow of the code.

This is a simple implementation that can be used as a starting point to understand the basic mechanics of a blockchain.

## Classes

### Blockchain

The `Blockchain` class represents a blockchain, which is a chain of blocks that contain data. It has the following methods:

- `createGenesisBlock` creates and returns the first block in the blockchain, known as the genesis block.
- `getLatestBlock` returns the latest block in the chain.
- `addBlock` adds a new block to the chain by setting the new block's previous hash to the hash of the latest block, mining the new block, and adding it to the chain.
- `calculateNonce` calculates the nonce value of a block by repeatedly recalculating the block's hash until it meets the required difficulty level (determined by the `DIFFICULTY` constant).
- `verifyNonce` verifies the nonce of a block by comparing it to the nonce value calculated using `calculateNonce`.

### Block

The `Block` class represents a block, which consists of data and a hash. A block's hash is calculated using the SHA-256 cryptographic hash function and is based on the block's data, previous block's hash, timestamp, and nonce. It has the following methods:

- `calculateHash` calculates and returns the hash of the block.
- `mineBlock` mines the block by repeatedly recalculating the block's hash until it meets the required difficulty level (determined by the `difficulty` argument).

## Components

### App

The `App` component is a React component that displays the blocks in the blockchain and allows the user to add new blocks to the chain or verify the nonce of a block. The user can input data for a new block in a text field, and when the user clicks the "Add block" button, the `addBlock`

## Running the App

To run the app, you will need to have `Node.js` and `npm` installed on your machine.

Clone the repository or download the source code.
Navigate to the project directory in a terminal.
Run `npm install` to install the required dependencies.
Run `npm start` to start the development server.
The app will be available at `http://localhost:3000/`.
Note that this app is a client-side application and does not require a backend server to function. However, it does use the SHA-256 cryptographic hash function, which is provided by the `crypto-js` library.