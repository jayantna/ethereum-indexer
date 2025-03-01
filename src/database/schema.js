const db = require('./db');

async function createTables() {
  try {
    // Create blocks table
    await db.query(`
      CREATE TABLE IF NOT EXISTS blocks (
        number BIGINT PRIMARY KEY,
        hash VARCHAR(66) UNIQUE NOT NULL,
        parent_hash VARCHAR(66) NOT NULL,
        timestamp BIGINT NOT NULL,
        miner VARCHAR(42) NOT NULL,
        gas_used BIGINT NOT NULL,
        gas_limit BIGINT NOT NULL,
        base_fee_per_gas BIGINT,
        indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        hash VARCHAR(66) PRIMARY KEY,
        block_number BIGINT NOT NULL,
        from_address VARCHAR(42) NOT NULL,
        to_address VARCHAR(42),
        value NUMERIC(78, 0) NOT NULL,
        gas_used BIGINT NOT NULL,
        gas_price NUMERIC(78, 0) NOT NULL,
        nonce INTEGER NOT NULL,
        transaction_index INTEGER NOT NULL,
        status BOOLEAN,
        indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (block_number) REFERENCES blocks(number)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

module.exports = { createTables }; 