import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ReviewAttributes {
  id: number;
  description: string;
  authorId: number;
  recipeId: number;
  title: string;
  isPublished: boolean;
  publishedOn: Date | null;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ReviewInput extends Optional<ReviewAttributes, "id"> {}

export interface ReviewOuput extends Required<ReviewAttributes> {}

export class Review
  extends Model<ReviewAttributes, ReviewInput>
  implements ReviewAttributes
{
  public id!: number;
  public authorId!: number;
  public recipeId!: number;
  public description!: string;
  public title!: string;
  public isPublished!: false;
  public publishedOn!: Date;
  public rating!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export const ReviewInit = (sequelize: Sequelize) => {
  const Review = sequelize.define<Review>(
    "Review",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      publishedOn: {
        type: DataTypes.DATE,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );

  // @ts-ignore
  Review.associate = (models) => {
    Review.belongsTo(models.Recipe, { foreignKey: "recipeId" });
    Review.belongsTo(models.User, {
      foreignKey: "authorId",
    });
  };

  return Review;
};
