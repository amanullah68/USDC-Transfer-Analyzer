import USDCTransfer from "../models/transferTokenSchema.js";
import apiResponse from "../utils/apiResponse.js";
import httpCodes from "../constants/httpCodes.js";
import logger from "../logger/winston.js";

// calculating total transferred USDC
export const getTotalUSDCTransferred = async (req, res) => {
  try {
    let query = {};

    // Check if time period is provided
    if (req.query.startTime && req.query.endTime) {
      if (req.query.startTime < req.query.endTime) {
        query.timestamp = {
          $gte: req.query.startTime,
          $lte: req.query.endTime,
        };
      }
    }

    console.log("query:", query);

    const totalUSDCTransferred = await USDCTransfer.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalUSDCTransferred: { $sum: { $toDouble: "$value" } }, // Assuming value is stored as string and needs conversion to double
        },
      },
    ]);

    logger.info("Total USDC transferred fetched successfully");
    return res.status(httpCodes.OK).json(
      apiResponse({
        data: totalUSDCTransferred[0] ? totalUSDCTransferred[0].totalUSDCTransferred : 0,
        message: "Success",
      })
    );
  } catch (error) {
    logger.error(error.message);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse({ error: error.message }));
  }
};

// get accounts according to number of txs
export const getAccountsByNumberOfTxs = async (req, res) => {
  try {
    const accountsByNumberOfTxs = await USDCTransfer.aggregate([
      {
        $group: {
          _id: "$from",
          numberOfTxs: { $sum: 1 },
        },
      },
      { $sort: { numberOfTxs: -1 } },
      { $project: { walletAddress: "$_id", numberOfTxs: 1, _id: 0 } },
    ]);

    logger.info("Accounts fetched successfully by number of transactions");
    return res
      .status(httpCodes.OK)
      .json(apiResponse({ data: accountsByNumberOfTxs }));
  } catch (error) {
    logger.error(error.message);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse({ error: error.message }));
  }
};
