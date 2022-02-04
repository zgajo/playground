import sequelizeConnection from "../config";
import Recipe from "./Recipe";
import Review from "./Review";
import User from "./User";
import "./associations";

export { Recipe, Review, User };
// console.log("''''''''''''''''''''''''''''");
// console.log("sdkljds", require(path.join(__dirname, "./User")));
// console.log("''''''''''''''''''''''''''''");
// const models = {
//   [User.name]: require(path.join(__dirname, "./User"))(sequelize, DataTypes),
//   [Recipe.name]: require(path.join(__dirname, "./Recipe"))(
//     sequelize,
//     DataTypes
//   ),
//   [Review.name]: require(path.join(__dirname, "./Review"))(
//     sequelize,
//     DataTypes
//   ),
// };

// Object.keys(models).forEach((modelName) => {
//   if ("associate" in models[modelName]) {
//     models[modelName].associate(models);
//   }
// });

// models.sequelize = sequelize;
// models.Sequelize = Sequelize;

// const sequelizeOptions = { logging: console.log };

// sequelize.sync(sequelizeOptions).catch((err) => {
//   console.log(err);
//   process.exit();
// });

// export default models;
