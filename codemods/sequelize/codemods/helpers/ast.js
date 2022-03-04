const { isDbImport } = require('./sequelize');

module.exports = {
  /**
   *
   * @param {*} key example: db (that is an object)
   * @returns object that will search places of found @key
   */
  preparedObjectUsageSearch: (key) => ({
    object: {
      type: 'MemberExpression',
      object: {
        name: key,
      },
    },
  }),
  /**
   *
   * @param {*} key example: db (that is an object)
   * @returns object that will search destructred variables from the @key
   */
  preparedDestructureObjectUsageSearch: (key) => ({
    id: {
      type: 'ObjectPattern',
    },
    init: {
      object: { name: key },
    },
  }),
  /**
   *
   * @returns boolean
   * Checks if there is "./models" import
   */
  isModelsRequireImport: (node) => {
    const isRequireImport =
      node.init?.type === 'CallExpression' &&
      node.init?.callee?.name === 'require';

    if (!isRequireImport) return false;

    return isDbImport(node.init?.arguments[0]?.value);
  },

  preparedSequelizeImportSearch: () => ({
    init: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'require' },
      arguments: [{ type: 'Literal', value: 'sequelize' }],
    },
  }),
};
