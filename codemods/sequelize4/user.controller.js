const db = require("./models")

const fun = async () => {

  // deprecated methods
  await db["User"].findAndCount()
  await db.User.findAndCount()

  // deprecated Sequelize.prototype.Op 
  // because of this db.sequelize.Op wont exist, as sequelize inherits the Sequelize.prototype properties
  db.Sequelize.Op
  db.sequelize.Op
}

console.log(db.Sequelize.Op)


console.log("first")