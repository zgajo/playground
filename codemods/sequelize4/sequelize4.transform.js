const j = require('jscodeshift');
const {
  preparedObjectUsageSearch,
  preparedDestructureObjectUsageSearch,
  preparedRequireImportSearch,
  preparedSequelizeImportSearch,
} = require('./codemods/helpers/ast');
const { destructuringHelper } = require('./codemods/helpers/destructuring');
const { directMethodUsageHelper } = require('./codemods/helpers/direct-usage');
const {
  isDbImport,
  changeSequelizeCreationOperatorsAliasesProperty,
} = require('./codemods/helpers/sequelize');

/**
 * TODO: Should we add hooks deprecated changes?
 * TODO: There are some use cases that needs to be covered:
    
    const sequelize = db.sequelize
    const kk = sequelize.Op

    This is also for the 
    const User = db["User"]
 */

module.exports = (fileInfo, api) => {
  const root = j(fileInfo.source);

  /**
   * Changing Sequelize initaialization file
   */
  const sequelizeVariableDeclarator = root.find(
    j.VariableDeclarator,
    preparedSequelizeImportSearch()
  );

  // Grab the name of the imported sequelize module
  sequelizeVariableDeclarator.find(j.Identifier).forEach((node) => {
    // search for imported module name instance creation
    root
      .find(j.NewExpression, {
        callee: { name: node.value.name },
      })
      .forEach(changeSequelizeCreationOperatorsAliasesProperty);
  });

  /******************** END Changing Sequelize initaialization file ********************/

  /**
   * Working with created instance
   */
  root
    .find(j.VariableDeclarator, preparedRequireImportSearch())
    .forEach((node) => {
      if (isDbImport(node.value.init.arguments[0].value)) {
        // Changing directly used deprecated Model methods and sequelize instance
        root
          // find all db
          .find(
            j.MemberExpression,
            preparedObjectUsageSearch(node.value.id.name)
          )
          .forEach(directMethodUsageHelper);

        // Solves Destructured variables const { Op } = db.sequelize
        root
          // Fetch all variables that are created with destructuring const { Op }  = ...
          .find(
            j.VariableDeclarator,
            preparedDestructureObjectUsageSearch(node.value.id.name)
          )
          .forEach(destructuringHelper);
      }
    });

  return root.toSource({ quote: 'single' });
};
