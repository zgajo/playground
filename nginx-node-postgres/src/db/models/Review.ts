import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";

interface ReviewAttributes {
  id: number;
  description: string;
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

class Review
  extends Model<ReviewAttributes, ReviewInput>
  implements ReviewAttributes
{
  public id!: number;
  public authorId!: number;
  public receipeId!: number;
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

Review.init(
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
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: sequelizeConnection,
  }
);

export default Review;
