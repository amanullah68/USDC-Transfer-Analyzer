import { Router } from "express";
import {
  getAccountsByNumberOfTxs,
  getTotalUSDCTransferred,
} from "../controllers/transferController.js";

const router = Router();

router.get("/totalUsdcInPeriod", getTotalUSDCTransferred);
router.get("/topAccountsByTransactions", getAccountsByNumberOfTxs);

export default router;
