const j = require('jscodeshift');
const { sequelizeImportSearch, isModelsRequireImport } = require('./ast');
const { SEQUELIZE_LOWER_CASE } = require('./constants');
const { solveDestructureObject } = require('./destructuring');
const {
  solveEveryDirectModelsUsage,
  solveEveryDirectSequlizeUsage,
} = require('./direct-usage');
const {
  changeSequelizeCreationOperatorsAliasesProperty,
  isConfigAndHasOperatorAlias,
  changeConfigOperatorAlias,
  isVariableReassignement,
} = require('./sequelize');

class Sequelize5 {
  constructor(root) {
    this.root = root;
  }

  /**
   * Handle passed object into new Seqeuelize("", "", "", { "handling this object" })
   */
  handleSequelizeProperty() {
    const sequelizeVariableDeclarator = this.root.find(
      j.VariableDeclarator,
      sequelizeImportSearch()
    );

    // Grab the name of the imported sequelize module
    sequelizeVariableDeclarator.find(j.Identifier).forEach((node) => {
      // search for imported module name instance creation
      this.root
        .find(j.NewExpression, {
          callee: { name: node.value.name },
        })
        .forEach(changeSequelizeCreationOperatorsAliasesProperty);
    });
  }

  /**
   * Find the file with sequelize object
   */
  handleConfigObject() {
    this.root
      .find(j.ObjectExpression, isConfigAndHasOperatorAlias)
      .forEach(changeConfigOperatorAlias);
  }

  handleDirectSequelizeUsage() {
    // Find the sequelize.models and go through its every property
    solveEveryDirectModelsUsage(this.root, SEQUELIZE_LOWER_CASE, 'models');

    // Find all sequlize.Op, sequelize.Model usages
    solveEveryDirectSequlizeUsage(this.root, SEQUELIZE_LOWER_CASE);
  }

  handleImportedInitializedInstance() {
    // Find all "./models" and work with that variable name
    this.root
      .find(j.VariableDeclarator, isModelsRequireImport)
      .forEach((node) => {
        // Changing directly used deprecated Model methods and sequelize instance
        solveEveryDirectModelsUsage(this.root, node.value.id.name);
        // Solves Destructured variables const { Op } = db.sequelize
        solveDestructureObject(this.root, node.value.id.name);
      });
  }

  /**
   * find all sequelize re assignmenets, const sequelize = row.sequelize, we are seqrching by variable and the last part .sequelize
   * */
  handleReAssignedSequelize() {
    this.root
      .find(j.VariableDeclarator, isVariableReassignement)
      .forEach((nodePath) => {
        // Find the sequelize.models and go through its every property
        solveEveryDirectModelsUsage(this.root, nodePath.node.id.name, 'models');
        solveEveryDirectSequlizeUsage(this.root, nodePath.node.id.name);
      });
  }
}

module.exports = Sequelize5;
