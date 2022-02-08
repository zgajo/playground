import { createConnection } from "./db";
import { startServer } from "./server";

require("dotenv").config();

console.log(process.env.APP_NO);

const startApp = async () => {
  try {
    await createConnection();

    startServer();
  } catch (error) {
    console.log("error", error);
  }
};

startApp();
