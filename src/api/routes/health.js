const express = require('express');
const router = express.Router();

module.exports = (provider, indexer) => {
  router.get('/', async (req, res) => {
    try {
      const blockNumber = await provider.getBlockNumber();
      const indexedBlock = indexer.latestIndexedBlock;
      res.json({ 
        status: 'ok', 
        currentBlock: blockNumber,
        indexedBlock: indexedBlock,
        indexingInProgress: indexer.isIndexing
      });
    } catch (error) {
      console.error('Error fetching block number:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
}; 