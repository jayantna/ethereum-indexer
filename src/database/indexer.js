const { ethers } = require('ethers');
const db = require('./db');
require('dotenv').config();

class Indexer {
  constructor(provider) {
    this.provider = provider;
    this.isIndexing = false;
    this.latestIndexedBlock = 0;
  }

  async initialize() {
    try {
      // Get the latest indexed block from the database
      const result = await db.query('SELECT MAX(number) as latest_block FROM blocks');
      this.latestIndexedBlock = result.rows[0].latest_block || 0;
      console.log(`Initialized indexer. Latest indexed block: ${this.latestIndexedBlock}`);
    } catch (error) {
      console.error('Error initializing indexer:', error);
    }
  }

  async indexBlocks(fromBlock, toBlock) {
    if (this.isIndexing) {
      console.log('Indexing already in progress');
      return;
    }

    try {
      this.isIndexing = true;
      console.log(`Indexing blocks from ${fromBlock} to ${toBlock}`);

      for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber++) {
        await this.indexBlock(blockNumber);
      }

      this.latestIndexedBlock = toBlock;
      console.log(`Completed indexing blocks from ${fromBlock} to ${toBlock}`);
    } catch (error) {
      console.error('Error during indexing:', error);
    } finally {
      this.isIndexing = false;
    }
  }

  async indexBlock(blockNumber) {
    try {
      // Fetch block with transactions
      const block = await this.provider.getBlock(blockNumber, true);
      
      if (!block) {
        console.log(`Block ${blockNumber} not found`);
        return;
      }

      // Insert block into database
      await db.query(
        `INSERT INTO blocks (
          number, hash, parent_hash, timestamp, miner, gas_used, gas_limit, base_fee_per_gas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (number) DO NOTHING`,
        [
          block.number,
          block.hash,
          block.parentHash,
          block.timestamp,
          block.miner,
          block.gasUsed.toString(),
          block.gasLimit.toString(),
          block.baseFeePerGas ? block.baseFeePerGas.toString() : null
        ]
      );

      console.log(`Indexed block ${blockNumber}`);

      // Index transactions in the block
      if (block.transactions && block.transactions.length > 0) {
        for (const txHash of block.transactions) {
          await this.indexTransaction(txHash, blockNumber);
        }
        console.log(`Indexed ${block.transactions.length} transactions for block ${blockNumber}`);
      }
    } catch (error) {
      console.error(`Error indexing block ${blockNumber}:`, error);
    }
  }

  async indexTransaction(txHash, blockNumber) {
    try {
      // Get the full transaction receipt
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        console.log(`Transaction receipt not found for hash ${txHash}`);
        return;
      }

      // Get the full transaction details
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        console.log(`Transaction not found for hash ${txHash}`);
        return;
      }

      await db.query(
        `INSERT INTO transactions (
          hash, block_number, from_address, to_address, value, gas_used, 
          gas_price, nonce, transaction_index, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (hash) DO NOTHING`,
        [
          tx.hash,
          blockNumber,
          tx.from,
          tx.to || null, // Contract creation transactions have null 'to'
          tx.value.toString(),
          receipt.gasUsed.toString(),
          tx.gasPrice.toString(),
          tx.nonce,
          receipt.index,
          receipt.status === 1 // Will be true for success, false for failure
        ]
      );
    } catch (error) {
      console.error(`Error indexing transaction ${txHash}:`, error);
    }
  }
}

module.exports = Indexer; 