require("dotenv").config(); // this is important!

module.exports = {
  development: {
    username: "postgres",
    password: "postgres",
    database: "test",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5433,
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "test",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5433,
  },
  production: {
    username: process.env.POSTGRES_PRODUCTION_USERNAME,
    password: process.env.POSTGRES_PRODUCTION_PASSWORD,
    database: process.env.POSTGRES_PRODUCTION_DB,
    host: process.env.POSTGRES_PRODUCTION_HOST,
    dialect: "postgres",
    port: process.env.POSTGRES_PRODUCTION_PORT,
  },
};
