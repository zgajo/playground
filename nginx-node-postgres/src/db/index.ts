require("dotenv").config();

import { ConnectionRefusedError } from "sequelize";
import sequelizeConnection from "./config";

export const createConnection = async () => {
  let retries = 5;

  while (retries) {
    try {
      await sequelizeConnection.authenticate();

      console.log("DB connection established");
      break;
    } catch (error) {
      --retries;
      console.log(
        "connecting to db, retries left: ",
        retries,
        ". Error: ",
        (error as ConnectionRefusedError).message
      );
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve("retry...");
        }, 3000)
      );
    }
  }

  return sequelizeConnection;
};
