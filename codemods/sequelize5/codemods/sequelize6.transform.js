const j = require("jscodeshift");

module.exports = (fileInfo, api, options) => {
  const root = j(fileInfo.source);

  root
    .find(j.CallExpression, (obj) => obj.callee?.property?.name === "spread")
    .forEach((astPath) => {
      const spreadFunction = astPath.value?.arguments[0];

      if (spreadFunction) {
        if (
          spreadFunction.type === "FunctionExpression" ||
          spreadFunction.type === "ArrowFunctionExpression"
        ) {
          astPath.value.callee.property.name = "then";

          const spreadFunctionParams = spreadFunction.params.map((param) => {
            return param.name;
          });

          j.arrayPattern("test");

          let test = j.variableDeclaration("const", [
            j.variableDeclarator(j.identifier("test"), null),
          ]);

          spreadFunction.body.body = [test, ...spreadFunction.body.body];
        }
      }
    });

  return root.toSource();
};
