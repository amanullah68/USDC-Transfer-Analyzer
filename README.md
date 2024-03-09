# USDC Transfer Analyzer
Backend service to track USDC transfer events and aggregate data

# How to run

# Install Dependencies
yarn install

# Set ENV variables
PORT=9003 <br />
DBURL='' mongodb URL to store data <br />
FROM_BLOCK: 7776529 <br />
RPC_ENDPOINT: "wss://avalanche-mainnet.infura.io/ws/v3/KEY" // set RPC endpoint for AVAX C-chain. <br />
USDC_ADDRESSES: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E <br />

# Development
yarn dev

# Production
npm start

# ENDPOINTS
You can import POSTMAN file as well for endpoints<br />
-> http://localhost:9003/usdc/totalUsdcInPeriod  (This endpoint use to fetch total USDC over a period of time)<br />
-> http://localhost:9003/usdc/topAccountsByTransactions (This endpoint use to fetch top accounts according to no. of txs)

# Run through Docker
--------RUN using Docker-------

docker-compose down<br />
docker system prune<br />
docker volume prune<br />
