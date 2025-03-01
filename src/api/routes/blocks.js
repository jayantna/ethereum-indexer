const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/:number', async (req, res) => {
    try {
      const blockNumber = parseInt(req.params.number);
      const result = await db.query('SELECT * FROM blocks WHERE number = $1', [blockNumber]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Block not found' });
      }
      
      // Get transactions for this block
      const txResult = await db.query('SELECT * FROM transactions WHERE block_number = $1', [blockNumber]);
      
      const block = result.rows[0];
      block.transactions = txResult.rows;
      
      res.json(block);
    } catch (error) {
      console.error('Error fetching block:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}; 