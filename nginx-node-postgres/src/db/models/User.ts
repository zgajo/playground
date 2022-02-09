import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserInput
  extends Optional<UserAttributes, "id" | "firstName" | "lastName"> {}

export interface UserOutput extends Required<UserAttributes> {}

export class User
  extends Model<UserAttributes, UserInput>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export const UserInit = (sequelize: Sequelize) => {
  const User = sequelize.define<User>(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  // @ts-ignore
  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      foreignKey: "authorId",
    });
    User.hasMany(models.Review, {
      foreignKey: "authorId",
    });
  };

  return User;
};
