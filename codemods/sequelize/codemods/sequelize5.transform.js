const j = require('jscodeshift');
const {
  preparedObjectUsageSearch,
  preparedDestructureObjectUsageSearch,
  isModelsRequireImport,
  sequelizeImportSearch,
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
const Sequelize5 = require('./helpers/sequelize5');

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

  const transformer = new Sequelize5(root);

  transformer.handleSequelizeProperty();

  transformer.handleConfigObject();

  /******************** END Changing Sequelize initaialization file ********************/

  transformer.handleImportedInitializedInstance();

  transformer.handleDirectSequelizeUsage();

  transformer.handleReAssignedSequelize();

  return root.toSource({ quote: 'single' });
};
