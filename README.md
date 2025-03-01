

# Ethereum Blockchain Indexer

A Node.js application that indexes Ethereum blockchain data into a PostgreSQL database and provides API endpoints to query the indexed data.

## Features

- Indexes Ethereum blocks and transactions
- Stores blockchain data in PostgreSQL
- Provides RESTful API endpoints to query indexed data
- Built with Node.js, Express, ethers.js, and PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Alchemy API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ethereum-indexer.git
   cd ethereum-indexer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   ALCHEMY_API_KEY=your_alchemy_api_key
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DB=ethereum_indexer
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   PORT=3000
   ```

4. Create the PostgreSQL database:
   ```bash
   psql -U postgres
   CREATE DATABASE ethereum_indexer;
   \q
   ```

## Usage

### Start the server

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### API Endpoints

- `GET /health` - Check server health and indexing status
- `GET /blocks/:number` - Get block data by block number
- `GET /transactions/:hash` - Get transaction data by transaction hash

## Project Structure

```
ethereum-indexer/
├── src/
│   ├── index.js        # Main application entry point
│   ├── db.js           # Database connection
│   ├── schema.js       # Database schema
│   └── indexer.js      # Blockchain indexing logic
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## How It Works

1. The application connects to the Ethereum network using Alchemy's API
2. It fetches blocks and transactions from the blockchain
3. The data is stored in PostgreSQL tables
4. The Express server provides API endpoints to query the indexed data

## Database Schema

### Blocks Table
- `number` - Block number (primary key)
- `hash` - Block hash
- `parent_hash` - Parent block hash
- `timestamp` - Block timestamp
- `miner` - Miner address
- `gas_used` - Gas used in the block
- `gas_limit` - Gas limit of the block
- `base_fee_per_gas` - Base fee per gas (EIP-1559)
- `indexed_at` - Timestamp when the block was indexed

### Transactions Table
- `hash` - Transaction hash (primary key)
- `block_number` - Block number (foreign key)
- `from_address` - Sender address
- `to_address` - Recipient address
- `value` - Transaction value in wei
- `gas_used` - Gas used by the transaction
- `gas_price` - Gas price in wei
- `nonce` - Transaction nonce
- `transaction_index` - Index of the transaction in the block
- `status` - Transaction status (success/failure)
- `indexed_at` - Timestamp when the transaction was indexed

## Future Enhancements

- Index contract events (logs)
- Track token transfers (ERC-20, ERC-721)
- Monitor account balances
- Add support for chain reorganizations
- Implement more advanced querying capabilities

## Test Snippet

![Health Check](./public/health-test.png)

![Block](./public/block-test.png)

![Transaction](./public/transaction-test.png)

## License

[MIT](LICENSE)
