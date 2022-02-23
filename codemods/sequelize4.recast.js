
const db = require("./sequelize4/models")
const recast = require("recast");
const ast = recast.parse(db)
console.log(ast)