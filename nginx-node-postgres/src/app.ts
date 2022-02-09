import { createConnections } from "./db/config";
import { startServer } from "./server";

require("dotenv").config();

const startApp = async () => {
  try {
    await createConnections();

    startServer();
  } catch (error) {
    console.log("error", error);
  }
};

startApp();
