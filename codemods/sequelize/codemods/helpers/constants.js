// Sequelize - Removed aliases https://sequelize.org/v5/manual/upgrade-to-v5.html
// not including - dont know what it does Sequelize.prototype[error]

module.exports = {
  DEPRECATED_SEQUELIZE_ALIASES: [
    "Utils",
    "Promise",
    "TableHints",
    "Op",
    "Transaction",
    "Model",
    "Deferrable",
    "Error",
  ],
  DEPRECATED_MODEL_METHODS: [
    "insertOrUpdate",
    "find",
    "findAndCount",
    "findOrInitialize",
    "updateAttributes",
    "findById",
    "findByPrimary",
    "all",
    "hook",
  ],
  SEQUELIZE_CAPITALIZED: "Sequelize",
  SEQUELIZE_LOWER_CASE: "sequelize",
};
