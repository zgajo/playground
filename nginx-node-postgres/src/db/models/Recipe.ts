import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface RecipeMetadata {
  cookingTime: string | null;
}

interface RecipeAttributes {
  id: number;
  title: string;
  instruction: string;
  meta?: RecipeMetadata;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RecipeInput extends Optional<RecipeAttributes, "id"> {}
export interface RecipeOutput extends Required<RecipeAttributes> {}

export class Recipe
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

export const RecipeInit = (sequelize: Sequelize) => {
  const Recipe = sequelize.define<Recipe>(
    "Recipe",
    {
      id: {
        type: DataTypes.INTEGER,
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
      authorId: {
        type: DataTypes.INTEGER,
      },
    },

    {
      paranoid: true,
    }
  );

  // @ts-expect-error
  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: "authorId",
    });
    Recipe.hasMany(models.Review, { foreignKey: "recipeId" });
  };

  return Recipe;
};
