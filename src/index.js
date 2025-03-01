const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const db = require('./database/db');
const { createTables } = require('./database/schema');
const Indexer = require('./database/indexer');
const api = require('./api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);

// Initialize indexer
const indexer = new Indexer(provider);

// Initialize database and start indexer
async function initialize() {
  await createTables();
  await indexer.initialize();
  
  // Start indexing from the latest indexed block + 1
  const currentBlock = await provider.getBlockNumber();
  console.log("currentBlock", currentBlock);
  parseInt(indexer.latestIndexedBlock) == 0 ? startBlock = 100000 : startBlock = parseInt(indexer.latestIndexedBlock) + 1;
  console.log("latestIndexedBlock", indexer.latestIndexedBlock, typeof parseInt(indexer.latestIndexedBlock));
  if (startBlock <= currentBlock) {
    // Index in batches of n*blocks
    const batchSize = BATCH_SIZE
    const endBlock = Math.min(startBlock + batchSize - 1, currentBlock);
    console.log("startBlock", startBlock);
    console.log("endBlock", endBlock);
    indexer.indexBlocks(startBlock, endBlock);
  }
}

initialize();
// getBlock(654174);
// async function getBlock(blockNumber) {
//   const block = await provider.getBlock(blockNumber);
//   console.log("block", block.transactions);
// }
// getTransaction("0x94cc6763b6d79f7c3a33bb9b9cb958101a4b2184b80a52102284839021ad37bf");
// async function getTransaction(hash) {
//   const transaction = await provider.getTransaction(hash);
//   console.log("transaction", transaction);
// }

// Mount API routes
app.use('/', api(provider, indexer, db));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 