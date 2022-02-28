const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = {};

console.log(db);

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // logging: console.log,

  // SQLite only
  storage: './database.sqlite',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
  operatorsAliases: true,
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file !== 'readonly.js' &&
      file !== 'readonly-exports.js'
    );
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .sync()
  .then(async () => {
    const user = await db['User'].create({
      email: 'sdds@wee.fds',
      country: 'HRV',
    });

    return user;
  })
  .then(async (user) => {
    console.log(await db['User'].findAndCount());
    console.log(user.toJSON());
  });

module.exports = db;
