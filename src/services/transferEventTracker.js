import Web3 from "web3";
import USDCTransfer from "../models/transferTokenSchema.js";

const RECONNECT_DELAY = 5000;
const BLOCK_DIFFERENCE = 50; // Specify the block difference for each batch

let web3 = null;
let subscription = null; // Keep track of the subscription

const connectWeb3 = () => {
  web3 = new Web3(process.env.RPC_ENDPOINT);

  // Handle disconnect event
  web3.currentProvider.on("end", () => {
    console.error("Connection dropped by remote peer. Reconnecting...");
    reconnectWeb3();
  });
};

const reconnectWeb3 = () => {
  setTimeout(() => {
    console.log("Attempting to reconnect...");
    connectWeb3();
    // Re-establish the subscription after reconnection
    if (subscription) {
      // Unsubscribe before resubscribing to avoid duplicate subscriptions
      subscription.unsubscribe((error, success) => {
        if (success) {
          console.log("Unsubscribed from previous subscription.");
          subscribeToLogs(); // Re-subscribe
        } else {
          console.error("Error unsubscribing:", error);
        }
      });
    } else {
      subscribeToLogs(); // If there was no subscription, subscribe again
    }
    console.log("Reconnected successfully");
  }, RECONNECT_DELAY);
};

const fetchHighestBlockNumberFromDB = async () => {
  try {
    // Query the database to get the highest block number
    const highestBlock = await USDCTransfer.findOne(
      {},
      {},
      { sort: { blockNumber: -1 } }
    );
    if (highestBlock) {
      return highestBlock.blockNumber;
    } else {
      return Number(process.env.FROM_BLOCK);
    }
  } catch (error) {
    console.error("Error fetching highest block number from DB:", error);
    // If an error occurs, fallback to the FROM_BLOCK environment variable
    return Number(process.env.FROM_BLOCK);
  }
};

const subscribeToLogs = async () => {
  try {
    let fromBlock =
      Number(await fetchHighestBlockNumberFromDB()) ||
      Number(process.env.FROM_BLOCK);
    let latestBlock = await web3.eth.getBlockNumber();

    while (fromBlock < latestBlock) {
      const toBlock = Math.min(fromBlock + BLOCK_DIFFERENCE, latestBlock);
      await fetchLogs(fromBlock, toBlock);
      fromBlock += BLOCK_DIFFERENCE + 1;
    }

    console.log("All logs fetched up to the latest block.");
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};

const fetchLogs = async (fromBlock, toBlock) => {
  try {
    let currentBlock = fromBlock;
    while (currentBlock < toBlock) {
      const nextBlock = Math.min(currentBlock + BLOCK_DIFFERENCE, toBlock);
      const logs = await web3.eth.getPastLogs({
        address: process.env.USDC_ADDRESSES,
        topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
        fromBlock: web3.utils.toHex(currentBlock),
        toBlock: web3.utils.toHex(nextBlock),
      });

      for (const log of logs) {
        await processLog(log);
      }

      currentBlock = nextBlock + 1;
    }
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};

const processLog = async (log) => {
  try {
    // Decode log data and process
    const { from, to, value, txHash, timestamp, blockNumber } =
      await decodeLogData(log);
    console.log("Current Block:", blockNumber);
    
    await saveTransactionHistory(
      from,
      to,
      value,
      txHash,
      timestamp,
      blockNumber
    );
  } catch (error) {
    console.error("Error processing log:", error);
  }
};

const decodeLogData = async (log) => {
  const { topics, data, transactionHash, blockNumber } = log;
  let { from, to, value } = web3.eth.abi.decodeLog(
    [
      {
        type: "address",
        name: "from",
        indexed: true,
      },
      {
        type: "address",
        name: "to",
        indexed: true,
      },
      {
        type: "uint256",
        name: "value",
        indexed: false,
      },
    ],
    data,
    [topics[1], topics[2], topics[3]]
  );
  const txHash = transactionHash;
  const blockDetails = await web3.eth.getBlock(blockNumber);
  const timestamp = blockDetails.timestamp;
  return { from, to, value, txHash, timestamp, blockNumber };
};

const saveTransactionHistory = async (
  from,
  to,
  value,
  txHash,
  timestamp,
  blockNumber
) => {
  let newTransfer = new USDCTransfer({
    txHash: txHash,
    from: from,
    to: to,
    value: value,
    timestamp: timestamp,
    blockNumber: blockNumber,
  });
  await newTransfer.save();
};

const trackERC20Transfers = async () => {
  try {
    console.log("Starting event tracking for ERC20 transfers...");
    await connectWeb3();
    await subscribeToLogs();
  } catch (error) {
    console.error("Error in event tracking:", error);
  }
  process.stdin.resume();
};

export { trackERC20Transfers };
