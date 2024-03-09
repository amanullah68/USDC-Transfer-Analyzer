import express from "express";
import cors from "cors";
import morgan from "morgan";
import nft from "./routes/transferTokenRouter.js";

// Allow requests from a specific origin: http://192.168.19.101:3000
const allowedOrigins = ["*"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

//routes
app.use("/usdc", nft);

export default app;
