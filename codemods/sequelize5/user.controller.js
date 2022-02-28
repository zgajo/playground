const db = require('./models');

const fun = async () => {
  // deprecated methods
  await db['User'].findAndCountAll();
  await db.User.findAndCountAll();

  // deprecated Sequelize.prototype.Op
  // because of this db.sequelize.Op wont exist, as sequelize inherits the Sequelize.prototype properties
  db.Sequelize.Op;
  db.Sequelize.Op;

  const { Op } = db.Sequelize;
  const { Model } = db['Sequelize'];
  const { findAndCountAll } = db.User;
  const { upsert } = db['User'];
  const updateAttributes = db['User'].update;
  const findById = db.User.findByPk;
};

console.log(db.Sequelize.Op);

console.log('first');
