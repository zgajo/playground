const j = require("jscodeshift");

module.exports = (fileInfo, api, options) => {
  const root = j(fileInfo.source);

  root
    .find(j.CallExpression, (obj) => obj.callee?.property?.name === "spread")
    .replaceWith((nodePath) => {
      const { node } = nodePath;

      node.callee.property.name = "then";

      return node;
    })
    .forEach((astPath) => {
      const { node } = astPath;
      // A function that is passed into a spread function
      const spreadFunction = node.arguments[0];

      if (spreadFunction) {
        if (
          spreadFunction.type === "FunctionExpression" ||
          spreadFunction.type === "ArrowFunctionExpression"
        ) {
          const spreadFunctionParams = spreadFunction.params.map((param) => {
            return j.identifier(param.name);
          });

          const arr = j.arrayPattern(spreadFunctionParams);

          spreadFunction.params = [arr];
        }
      }
    });

  return root.toSource();
};

// return root
//   .find(j.ArrowFunctionExpression, {
//     loc: {
//       start: spreadFunction.loc.start,
//       end: spreadFunction.loc.end,
//     },
//   })
//   .replaceWith((nodePath) => {
//     const { node } = nodePath;

//     node.params = [arr];
//     return node;
//   });
