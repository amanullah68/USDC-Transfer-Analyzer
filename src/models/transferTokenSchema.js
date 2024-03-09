import mongoose from "mongoose";

const transferUSDCSchema = new mongoose.Schema({
  txHash: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, default: null },
  timestamp: { type: String, required: true },
  blockNumber: { type: String, required: true },
});

const USDCTransfer = mongoose.model("USDCTransfer", transferUSDCSchema);

export default USDCTransfer;
