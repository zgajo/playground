const j = require('jscodeshift');
const {
  preparedObjectUsageSearch,
  preparedDestructureObjectUsageSearch,
  isModelsRequireImport,
  preparedSequelizeImportSearch,
} = require('./helpers/ast');
const { SEQUELIZE_LOWER_CASE } = require('./helpers/constants');
const {
  destructuringHelper,
  solveDestructureObject,
} = require('./helpers/destructuring');
const {
  searchForObjectProperties,
  solveEveryDirectModelsUsage,
  solveEveryDirectSequlizeUsage,
} = require('./helpers/direct-usage');
const {
  isDbImport,
  changeSequelizeCreationOperatorsAliasesProperty,
  isConfigAndHasOperatorAlias,
  changeConfigOperatorAlias,
  isVariableReassignement,
} = require('./helpers/sequelize');

/**
 * TODO: Should we add hooks deprecated changes?
 * TODO: There are some use cases that needs to be covered:
    
    const sequelize = db.sequelize
    const kk = sequelize.Op

    This is also for the 
    const User = db["User"]
 */

module.exports = (fileInfo, api, options) => {
  const root = j(fileInfo.source);

  try {
    /**
     * Changing Sequelize initaialization file
     */
    const sequelizeVariableDeclarator = root.find(
      j.VariableDeclarator,
      options.sequelizeImport || preparedSequelizeImportSearch()
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

    /**
     * Checking for the sequelize object files
     */
    root
      .find(j.ObjectExpression, isConfigAndHasOperatorAlias)
      .forEach(changeConfigOperatorAlias);

    /******************** END Changing Sequelize initaialization file ********************/

    // Find all "./models" and work with that variable name
    root.find(j.VariableDeclarator, isModelsRequireImport).forEach((node) => {
      // Changing directly used deprecated Model methods and sequelize instance
      solveEveryDirectModelsUsage(root, node.value.id.name);
      // Solves Destructured variables const { Op } = db.sequelize
      solveDestructureObject(root, node.value.id.name);
    });

    // Find the sequelize.models and go through its every property
    solveEveryDirectModelsUsage(root, SEQUELIZE_LOWER_CASE, 'models');

    // Find all sequlize.Op, sequelize.Model usages
    solveEveryDirectSequlizeUsage(root, SEQUELIZE_LOWER_CASE);

    // find all sequelize re assignmenets, const sequelize = row.sequelize, we are seqrching by variable and the last part .sequelize
    root
      .find(j.VariableDeclarator, isVariableReassignement)
      .forEach((nodePath) => {
        // Find the sequelize.models and go through its every property
        solveEveryDirectModelsUsage(root, nodePath.node.id.name, 'models');
        solveEveryDirectSequlizeUsage(root, nodePath.node.id.name);
      });
  } catch (error) {
    console.log('error', error);
  }

  return root.toSource({ quote: 'single' });
};
