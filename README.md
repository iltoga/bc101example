# Blockchain Demo

This is a small application that demonstrates the use of blockchain technology.

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

The `App` component is a React component that displays the blocks in the blockchain and allows the user to add new blocks to the chain or verify the nonce of a block. The user can input data for a new block in a text field, and when the user clicks the "Add block" button, the `addBlock` method of the `blockchain` object is called with the new block. The user can also input a block's hash in a text field and click the "Verify nonce" button, which will use the `verifyNonce` method to check if the block's nonce is valid. The component's state

### Running the App

To run the app, you will need to have `Node.js` and `npm` installed on your machine.

Clone the repository or download the source code.
Navigate to the project directory in a terminal.
Run `npm install` to install the required dependencies.
Run `npm start` to start the development server.
The app will be available at `http://localhost:3000/`.
Note that this app is a client-side application and does not require a backend server to function. However, it does use the SHA-256 cryptographic hash function, which is provided by the `crypto-js` library.