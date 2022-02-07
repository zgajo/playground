import { Recipe, Review, User } from ".";
/**  User */
User.hasMany(Recipe, {
  foreignKey: "authorId",
});
User.hasMany(Review, {
  foreignKey: "authorId",
});

/**  Recipe */
Recipe.belongsTo(User, {
  foreignKey: "authorId",
});
Recipe.hasMany(Review, { foreignKey: "recipeId" });

/**  Review */
Review.belongsTo(Recipe, { foreignKey: "recipeId" });
Review.belongsTo(User, {
  foreignKey: "authorId",
});
