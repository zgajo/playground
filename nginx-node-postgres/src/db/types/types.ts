import { ModelCtor } from "sequelize/types";
import { Recipe } from "../models/Recipe";
import { Review } from "../models/Review";
import { User } from "../models/User";

export interface IDBConnectionModel {
  User: ModelCtor<User>;
  Recipe: ModelCtor<Recipe>;
  Review: ModelCtor<Review>;
}
