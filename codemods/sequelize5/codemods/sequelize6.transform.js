const j = require("jscodeshift");
const _ = require("lodash");
const { preparedRequireImportSearch } = require("./helpers/ast");
const { isDbImport } = require("./helpers/sequelize");

const isSearchedObjectName = (memberExpression, objName, objectLevel) => {
  let obj = memberExpression.object;
  while (obj) {
    if (_.get(obj, objectLevel) === objName) {
      return true;
    }
    obj = obj.callee?.object;
  }
};

const spreadFnChange = (root, objectNameLevel, searchName) =>
  // find all the spread expressions if they start with imported /models etc name.
  // e.g for imported const db = require(./models)
  // find db.Model.find().spread
  root
    .find(j.Identifier, (obj) => {
      return obj.name === "spread";
    })
    .forEach((spreadPath) => {
      const { node: parent } = spreadPath.parent;

      // find spread that is used by found imports
      if (isSearchedObjectName(parent, searchName, objectNameLevel)) {
        spreadPath.value.name = "then";

        const spreadFunction =
          spreadPath.parentPath?.parentPath?.value?.arguments[0];

        if (spreadFunction) {
          // destructure parameters in stream (row)=>{} ([row])=>{}
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
      }
    });

module.exports = (fileInfo, api, options) => {
  const root = j(fileInfo.source);

  root
    .find(j.VariableDeclarator, (nodePath) => {
      // find require function keyword
      const isRequireImport =
        nodePath.init?.type === "CallExpression" &&
        nodePath.init?.callee?.type === "Identifier" &&
        nodePath.init?.callee?.name === "require";

      if (!isRequireImport) return;

      // check if the import is /models etc...
      if (!isDbImport(nodePath.init?.arguments[0]?.value)) return;

      return nodePath;
    })
    .forEach(({ node }) => {
      const searchName = node.id.name;
      spreadFnChange(root, "object.name", searchName);
    });

  root
    .find(j.VariableDeclarator, (nodePath) => {
      // This will check only if the .define is used.
      // for something extra we could check the passed function parameters but currently this is complicating things
      return nodePath.init?.callee?.property?.name === "define";
    })
    .forEach(({ node }) => {
      const searchName = node.id.name;
      spreadFnChange(root, "name", searchName);
    });

  // fetch all the require("sequelize") imports
  root
    .find(j.VariableDeclarator, {
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ type: "Literal", value: "sequelize" }],
      },
    })
    .forEach((nodePath) => {
      const { node } = nodePath;
      // name of the variable to which is module assigned to
      const sequelizeName = node.id.name;

      root
        // searching initialization of the imported class. e.g. new Sequelize()
        .find(j.VariableDeclarator, {
          init: { type: "NewExpression", callee: { name: sequelizeName } },
        })
        .forEach((nodePath) => {
          const { node: initializedNode } = nodePath;

          root
            // Find all variables where is sequelize.import or sequelize["import"] on the init side
            // e.g. const model = sequelize.import(path.join(__dirname, file));
            .find(
              j.VariableDeclarator,
              (obj) =>
                obj.init?.callee?.object?.name === initializedNode.id.name &&
                (obj.init?.callee?.property?.value === "import" ||
                  obj.init?.callee?.property?.name === "import")
            )
            .forEach((variablePath) => {
              const { node: variableDeclarator } = variablePath;

              const pathJoinArgument = variableDeclarator.init.arguments[0];

              // creating from: sequelize.import(path.join(__dirname, file));
              // to: require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
              const modelRequire = j.callExpression(
                j.callExpression(j.identifier("require"), [pathJoinArgument]),
                [
                  j.identifier(initializedNode.id.name),
                  j.memberExpression(
                    j.identifier(sequelizeName),
                    j.identifier("DataTypes")
                  ),
                ]
              );

              // change the right side of the variable
              variableDeclarator.init = modelRequire;

              return nodePath;
            });
        });
    });

  // search for the sequelize import, with assumption that .define is only used as sequelize method
  root
    .find(j.MemberExpression, (obj) => obj.property.name === "define")
    .forEach((nodePath) => {
      const { node } = nodePath;

      const sequelizeName = node.object.name;

      const foundArgumentsIndex = [];

      root
        .find(j.CallExpression, (callFn) => {
          const index = callFn.arguments.findIndex(
            (identifier) => identifier.name === sequelizeName
          );

          if (index === -1) return false;
          console.log(index);

          foundArgumentsIndex.push(index);

          return true;
        })
        .forEach(({ node: callFn }, index) => {
          // if sequelize if passed into method. e.g. kycService.getRealKycStatus(user, sequelize)
          if (callFn.callee.object && callFn.callee.property) {
          }
          // if sequelize if passed into function. e.g. getRealKycStatus(user, sequelize)
          else if (callFn.callee.name) {
            /* check if the function is created inside of the currently checked file */
            // Check: const getRealKycStatus = ()=>{}
            const variableDeclarator = root.find(
              j.VariableDeclarator,
              (declarator) =>
                declarator.id.name === callFn.callee.name &&
                (declarator.init.type === "ArrowFunctionExpression" ||
                  declarator.init.type === "FunctionExpression")
            );

            if (variableDeclarator.length) {
              // work with this
              const sequelizeIndex = foundArgumentsIndex[index];

              const sequelizeParamName =
                variableDeclarator.get("init")?.value?.params[sequelizeIndex]
                  ?.name;

              if (sequelizeParamName) {
                spreadFnChange(variableDeclarator, "name", sequelizeParamName);
              }

              return;
            }

            // Check: const function getRealKycStatus (test){}
            const functionDeclaration = root
              .find(
                j.FunctionDeclaration,
                (declarator) => declarator.id.name === sequelizeName
              )
              .forEach(({ node: fn }) => {
                fn.params;
              });

            /// check if the sequelize is passed into some other function
            /// if  node then find the model and methods usage in the function
            /* if not, then get require path from which is the fucntion imported */
            /// create the AST tree from that file and find the function export and the function declaration
          }
        });
    });

  return root.toSource();
};
