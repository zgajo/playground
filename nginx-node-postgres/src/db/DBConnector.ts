import diff from "microdiff";
import { Model, Sequelize } from "sequelize";
import { SequelizeHooks } from "sequelize/types/lib/hooks";
import localCache from "../lib/local-cache";
import { RecipeInit } from "./models/Recipe";
import { ReviewInit } from "./models/Review";
import { UserInit } from "./models/User";
import { IDBConnectionModel } from "./types";

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

export class DBConnector {
  connection: Sequelize;
  private sequelizeModels: IDBConnectionModel;

  constructor(dbConfig: any) {
    this.connection = new Sequelize(
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

    this.addModels();
    this.createAssociations();
  }

  get models() {
    return this.sequelizeModels;
  }

  addModels() {
    this.sequelizeModels = {
      User: UserInit(this.connection),
      Recipe: RecipeInit(this.connection),
      Review: ReviewInit(this.connection),
    };
  }

  createAssociations() {
    Object.keys(this.sequelizeModels).forEach((modelName) => {
      if ("associate" in this.sequelizeModels[modelName]) {
        this.sequelizeModels[modelName].associate(this.sequelizeModels);
      }
    });
  }
}
