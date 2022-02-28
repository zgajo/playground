const { defineTest } = require('jscodeshift/dist/testUtils');

describe('Codemod for creating sequelize instance', () => {
  // This is a test helper provided by jscodeshift.
  defineTest(
    // The current directory. This is used to automatically
    // load the transform and test fixtures.
    __dirname,
    // The name of the transform's filename (excluding extension).
    'sequelize4.transform.js',
    // Transform options. These are the custom options the transform
    // expects. This transform didn't use any custom options.
    {
      sequelizeImport: {
        init: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: 'sequelize' }],
        },
      },
    },
    // The name of the test fixtures. This will be suffixed with
    // input and output, including the extension.
    'models.index',
    // Jscodeshift options. We've been running via the
    // jscodeshift CLI with the `--parser babylon` flag passed,
    // so also passing that when running the tests.
    { parser: 'babylon' }
  );
});
