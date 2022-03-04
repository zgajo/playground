const Sequelize = require('sequelize');
module.exports = {
  findAllAndCountAuditLogsForInstance: async function (
    instanceId,
    modelNames,
    pagination,
    sequelize
  ) {
    return sequelize.models.BackofficeAuditLog.findAndCountAll({
      where: {
        instance_id: instanceId,
        model_name: {
          [Sequelize.Op.in]: modelNames,
        },
      },
      offset: pagination.offset,
      limit: pagination.limit,
      order: [['date', 'DESC']],
    });
  },
};
