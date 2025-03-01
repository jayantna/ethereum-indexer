const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/:hash', async (req, res) => {
    try {
      const hash = req.params.hash;
      const result = await db.query('SELECT * FROM transactions WHERE hash = $1', [hash]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}; 