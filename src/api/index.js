const express = require('express');
const router = express.Router();

const healthRoutes = require('./routes/health');
const blockRoutes = require('./routes/blocks');
const transactionRoutes = require('./routes/transactions');

module.exports = (provider, indexer, db) => {
  // Mount routes
  router.use('/health', healthRoutes(provider, indexer));
  router.use('/blocks', blockRoutes(db));
  router.use('/transactions', transactionRoutes(db));

  return router;
}; 