// Model - Removed aliases https://sequelize.org/v5/manual/upgrade-to-v5.html
const changeDeprecatedModelMethods = (methodName) => {
  switch (methodName) {
    case 'insertOrUpdate':
      return 'upsert';

    case 'find':
      return 'findOne';

    case 'findAndCount':
      return 'findAndCountAll';

    case 'findOrInitialize':
      return 'findOrBuild';

    case 'updateAttributes':
      return 'update';

    case 'findById' || 'findByPrimary':
      return 'findByPk';

    case 'all':
      return 'findAll';

    case 'hook':
      return 'addHook';

    default:
      return methodName;
  }
};

module.exports = {
  changeDeprecatedModelMethods,
};
