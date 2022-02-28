require('dotenv').config();

const ssl = require('./db-ssl-config');

const dev = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '5432',
  dialect: 'postgres',
  logging: console.log,
  seederStorage: 'sequelize',
  seederStorageTableName: 'SeederMeta',
  pool: {
    max: 10,
  },
  dialectOptions: {
    ssl:
      process.env.DB_SSL === 'false'
        ? false
        : {
            require: true,
            rejectUnauthorized: false,
          },
  },
  operatorAliases: false,
};

module.exports = {
  development: dev,
  dev,
  staging: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SeederMeta',
    pool: {
      max: 10,
    },
    dialectOptions: {
      ssl,
    },
    operatorAliases: false,
  },
  preprod: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SeederMeta',
    pool: {
      max: 10,
    },
    dialectOptions: {
      ssl,
    },
    operatorAliases: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SeederMeta',
    pool: {
      max: 10,
    },
    dialectOptions: {
      ssl,
    },
    operatorAliases: false,
  },
};
