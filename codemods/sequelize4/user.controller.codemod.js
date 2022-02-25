const j = require('jscodeshift');
const {
  preparedObjectUsageSearch,
  preparedDestructureObjectUsageSearch,
} = require('./codemods/helpers/ast');
const { destructuringHelper } = require('./codemods/helpers/destructuring');
const { directMethodUsageHelper } = require('./codemods/helpers/direct-usage');
const { isDbImport } = require('./codemods/helpers/sequelize');

/**
 * TODO: Should we add hooks deprecated changes?
 * TODO: There are some use cases that needs to be covered:
    
    const sequelize = db.sequelize
    const kk = sequelize.Op

    This is also for the 
    const User = db["User"]
 */

module.exports = (fileInfo, api) => {
  // const j = api.jscodeshift; // this line is not needed if we use imported j
  const root = j(fileInfo.source);

  const foundImports = {};

  root
    .find(j.VariableDeclarator, {
      init: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'require' },
      },
    })
    .forEach((node) => {
      if (isDbImport(node.value.init.arguments[0].value)) {
        foundImports[node.value.id.name] = node;
      }
    });

  for (const key in foundImports) {
    // Changing directly used deprecated Model methods and sequelize instance
    root
      // find all db
      .find(j.MemberExpression, preparedObjectUsageSearch(key))
      .forEach(directMethodUsageHelper);

    // Solves Destructured variables const { Op } = db.sequelize
    root
      // Fetch all variables that are created with destructuring const { Op }  = ...
      .find(j.VariableDeclarator, preparedDestructureObjectUsageSearch(key))
      .forEach(destructuringHelper);
  }

  return root.toSource();
};
