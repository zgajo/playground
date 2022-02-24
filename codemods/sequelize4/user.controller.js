const db = require('./models');

const fun = async () => {
  // deprecated methods
  await db['User'].findAndCount();
  await db.User.findAndCount();

  // deprecated Sequelize.prototype.Op
  // because of this db.sequelize.Op wont exist, as sequelize inherits the Sequelize.prototype properties
  db.Sequelize.Op;
  db.sequelize.Op;

  const { Op } = db.sequelize;
  const { findAndCount } = db.User;
  const { insertOrUpdate } = db['User'];
  const updateAttributes = db['User'].updateAttributes;
  const findById = db.User.findById;
};

console.log(db.Sequelize.Op);

console.log('first');
