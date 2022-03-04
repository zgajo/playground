const j = require('jscodeshift');
const {
  preparedObjectUsageSearch,
  preparedDestructureObjectUsageSearch,
  preparedRequireImportSearch,
  preparedSequelizeImportSearch,
} = require('./helpers/ast');
const { SEQUELIZE_LOWER_CASE } = require('./helpers/constants');
const { destructuringHelper } = require('./helpers/destructuring');
const {
  searchForObjectProperties,
  solveEveryDirectModelsUsage,
  solveEveryDirectSequlizeUsage,
} = require('./helpers/direct-usage');
const {
  isDbImport,
  changeSequelizeCreationOperatorsAliasesProperty,
  isConfigAndHasOperatorAlias,
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

    /******************** END Changing Sequelize initaialization file ********************/

    /**
     * Checking for the sequelize object files
     */
    root
      .find(j.ObjectExpression, isConfigAndHasOperatorAlias)
      .forEach((object) => {
        const property = object.value.properties.find(
          (property) => property.key.name === 'operatorAliases'
        );

        if (property) {
          if (property.value.value === true) {
            property.value.value = 1;
          } else if (property.value.value === false) {
            property.value.value = 0;
          }
        }
      });

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
            .forEach(searchForObjectProperties);

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

    // Find the sequelize.models and go through its every property
    solveEveryDirectModelsUsage(root, SEQUELIZE_LOWER_CASE);

    // Find all sequlize.Op, sequelize.Model usages
    solveEveryDirectSequlizeUsage(root, SEQUELIZE_LOWER_CASE);

    // find all sequelize re assignmenets, const sequelize = row.sequelize, we are seqrching by variable and the last part .sequelize
    root
      .find(j.VariableDeclarator, (obj) => {
        return (
          obj.id.type === 'Identifier' &&
          (obj.init?.property?.name === SEQUELIZE_LOWER_CASE ||
            obj.init?.property?.value === SEQUELIZE_LOWER_CASE)
        );
      })
      .forEach((nodePath) => {
        // Find the sequelize.models and go through its every property
        solveEveryDirectModelsUsage(root, nodePath.node.id.name);
        solveEveryDirectSequlizeUsage(root, nodePath.node.id.name);
      });
  } catch (error) {
    console.log('error', error);
  }

  return root.toSource({ quote: 'single' });
};
