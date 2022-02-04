require("dotenv").config();
import diff from "microdiff";
import { Dialect, Model, Sequelize } from "sequelize";
import { SequelizeHooks } from "sequelize/types/lib/hooks";
const config = require("./sequelize-env");

import localCache from "../lib/local-cache";

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

let dbConfig = config.development;

if (isTest) {
  dbConfig = config.test;
} else if (isProduction) {
  dbConfig = config.production;
}

const hooks: Partial<SequelizeHooks<Model<any, any>, any, any>> = {
  afterUpdate: (instance: Model<any, any>) => {
    const cacheKey = `${instance.constructor.name.toLowerCase()}s`;

    const currentData = instance.get({ plain: true });

    if (!localCache.hasKey(cacheKey)) {
      return;
    }

    const listingData = localCache.get<any>(cacheKey) as any[];
    const itemIndex = listingData.findIndex(
      (it) => it.id === instance.getDataValue("id")
    );
    const oldItemData = ~itemIndex ? listingData[itemIndex] : {};

    const instanceDiff = diff(oldItemData, currentData);

    if (instanceDiff.length > 0) {
      listingData[itemIndex] = currentData;
      localCache.set(cacheKey, listingData);
    }
  },
  afterCreate: (instance: Model<any, any>) => {
    const cacheKey = `${instance.constructor.name.toLowerCase()}s`;
    const currentData = instance.get({ plain: true });

    if (!localCache.hasKey(cacheKey)) {
      return;
    }

    const listingData = localCache.get<any>(cacheKey) as any[];
    listingData.push(currentData);

    localCache.set(cacheKey, listingData);
  },
};

const sequelizeConnection = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port || 5432,
    logging: false,
    define: { hooks },
    pool: {
      max: 10,
      min: 0,
    },
  }
);

export default sequelizeConnection;
