import { DataTypes, Model, Optional } from "sequelize";
import { Review } from ".";
import sequelizeConnection from "../config";
import User, { UserInput } from "./User";

interface RecipeMetadata {
  cookingTime: string | null;
}

interface RecipeAttributes {
  id: number;
  title: string;
  instruction: string;
  meta?: RecipeMetadata;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RecipeInput
  extends Optional<RecipeAttributes, "id" | "instruction"> {}
export interface RecipeOutput extends Required<RecipeAttributes> {}

class Recipe
  extends Model<RecipeAttributes, RecipeInput>
  implements RecipeAttributes
{
  public id!: number;
  public title!: string;
  public desc!: string;
  public instruction!: string;
  public authorId!: number;
  public meta!: RecipeMetadata;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: true,
  }
);

export default Recipe;
