const j = require('jscodeshift');

module.exports = function (fileInfo, api, options) {
  // In our codebase, this change is only relevant to files named actions.js

  return j(fileInfo.source)
    .find(j.ObjectExpression)  // Find a list of object literals
    .forEach(obj =>            // For each object literal …
      obj.value.properties.forEach(property => {
        // … go through each property …
        if (property.type !== 'Property') return;
        if (property.key.name !== 'promise') return;
        // … and if the key is 'promise', change it to 'request'
        property.key.name = 'request';
      })
    )
    .toSource();
};
