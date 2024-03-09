import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { trackERC20Transfers } from "./services/transferEventTracker.js";

const startEthereumTracking = async () => {
  try {
    await trackERC20Transfers();
    console.log("Ethereum event tracking service started.");
  } catch (error) {
    console.error("Error starting Ethereum event tracking service:", error);
  }
};

let main = async () => {
  const port = process.env.PORT || 5003;
  try {
    app.listen(port, async () => {
      await connectDB();
      console.log(`Server is running on port ${port}`);
    });

    // Start the Ethereum event tracking service
    await startEthereumTracking();
  } catch (error) {
    console.error(`Unable to start the server`, error);
  }
};
main();
