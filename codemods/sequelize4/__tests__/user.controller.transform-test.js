const { defineTest } = require("jscodeshift/dist/testUtils");

describe("Codemods imported module usage", () => {
  // This is a test helper provided by jscodeshift.
  defineTest(
    // The current directory. This is used to automatically
    // load the transform and test fixtures.
    __dirname,
    // The name of the transform's filename (excluding extension).
    "codemods/sequelize4.transform.js",
    // Transform options. These are the custom options the transform
    // expects. This transform didn't use any custom options.
    null,
    // The name of the test fixtures. This will be suffixed with
    // input and output, including the extension.
    "user.controller.direct-usage",
    // Jscodeshift options. We've been running via the
    // jscodeshift CLI with the `--parser babylon` flag passed,
    // so also passing that when running the tests.
    { parser: "babylon" }
  );

  defineTest(
    __dirname,
    "codemods/sequelize4.transform.js",
    null,
    "user.controller.destructure",
    { parser: "babylon" }
  );
});
