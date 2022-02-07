import { ConnectionRefusedError } from "sequelize";
import sequelizeConnection from "./config";
import dbInit from "./init";

export const createConnection = async () => {
  let retries = 5;

  while (retries) {
    try {
      await sequelizeConnection.authenticate();
      dbInit();

      console.log("DB connection established");
      return sequelizeConnection;
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
        }, 1000)
      );
    }
  }

  console.error("Couldn't connect to DB");
  return;
};
