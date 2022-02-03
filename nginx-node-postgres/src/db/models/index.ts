import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config";
import Ingredient from "./Ingredient";
import Recipe from "./Recipe";
import RecipeIngredient from "./RecipeIngredient";
import RecipeTag from "./RecipeTag";
import Review from "./Review";
import Tag from "./Tag";

export { Ingredient, Recipe, RecipeIngredient, RecipeTag, Review, Tag };

const models = {
  [Tag.name]: require(path.join(__dirname, "./Tag"))(sequelize, DataTypes),
  [Recipe.name]: require(path.join(__dirname, "./Recipe"))(
    sequelize,
    DataTypes
  ),
  [Ingredient.name]: require(path.join(__dirname, "./Ingredient"))(
    sequelize,
    DataTypes
  ),
  [Review.name]: require(path.join(__dirname, "./Review"))(
    sequelize,
    DataTypes
  ),
  [RecipeTag.name]: require(path.join(__dirname, "./RecipeTag"))(
    sequelize,
    DataTypes
  ),
  [RecipeIngredient.name]: require(path.join(__dirname, "./RecipeIngredient"))(
    sequelize,
    DataTypes
  ),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

const sequelizeOptions = { logging: console.log };

sequelize.sync(sequelizeOptions).catch((err) => {
  console.log(err);
  process.exit();
});

export default models;
