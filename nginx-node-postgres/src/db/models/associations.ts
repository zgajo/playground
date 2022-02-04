import { Recipe, Review, User } from ".";

User.hasMany(Recipe, {
  foreignKey: "authorId",
});
User.hasMany(Review, {
  foreignKey: "authorId",
});

Recipe.belongsTo(User, {
  foreignKey: "authorId",
});
Recipe.hasMany(Review, { foreignKey: "recipeId" });

Review.belongsTo(Recipe, { foreignKey: "recipeId" });
Review.belongsTo(User, {
  foreignKey: "authorId",
});
