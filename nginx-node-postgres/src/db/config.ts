require("dotenv").config();
import { ConnectionRefusedError } from "sequelize";
import { DBConnector } from "./utils/DBConnector";
const config = require("./sequelize-env");

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

let dbConfig = config.development;

if (isTest) {
  dbConfig = config.test;
} else if (isProduction) {
  dbConfig = config.production;
}

export const sequelizeConnection = new DBConnector(dbConfig);

export const insertOnlyConnection = new DBConnector({
  username: "insert_only_user",
  password: "Test1234",
  database: "test",
  host: process.env.POSTGRES_PRODUCTION_HOST || "127.0.0.1",
  dialect: "postgres",
  port: process.env.POSTGRES_PRODUCTION_PORT || 5433,
});

export const deleteOnlyConnection = new DBConnector({
  username: "delete_only_user",
  password: "Test1234",
  database: "test",
  host: process.env.POSTGRES_PRODUCTION_HOST || "127.0.0.1",
  dialect: "postgres",
  port: process.env.POSTGRES_PRODUCTION_PORT || 5433,
});

export const updateOnlyConnection = new DBConnector({
  username: "update_only_user",
  password: "Test1234",
  database: "test",
  host: process.env.POSTGRES_PRODUCTION_HOST || "127.0.0.1",
  dialect: "postgres",
  port: process.env.POSTGRES_PRODUCTION_PORT || 5433,
});

export const readOnlyConnection = new DBConnector({
  username: "read_only_user",
  password: "Test1234",
  database: "test",
  host: process.env.POSTGRES_PRODUCTION_HOST || "127.0.0.1",
  dialect: "postgres",
  port: process.env.POSTGRES_PRODUCTION_PORT || 5433,
});

export const createConnections = async () => {
  let retries = 5;

  while (retries) {
    try {
      await sequelizeConnection.connection.authenticate();
      await readOnlyConnection.connection.authenticate();
      await updateOnlyConnection.connection.authenticate();
      await deleteOnlyConnection.connection.authenticate();
      await insertOnlyConnection.connection.authenticate();

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
};
