// Sequelize - Removed aliases https://sequelize.org/v5/manual/upgrade-to-v5.html
// not including - dont know what it does Sequelize.prototype[error]
const deprecatedSequelizeAliases = [
  'Utils',
  'Promise',
  'TableHints',
  'Op',
  'Transaction',
  'Model',
  'Deferrable',
  'Error',
];

module.exports = {
  deprecatedSequelizeAliases,
  SEQUELIZE_CAPITALIZED: 'Sequelize',
  SEQUELIZE_LOWER_CASE: 'sequelize',
};
