const Sequelize = require('sequelize');
module.exports = {
  findAllAndCountAuditLogsForInstance: async function (
    instanceId,
    modelNames,
    pagination,
    row
  ) {
    const banana = row.sequelize;

    return banana.models.BackofficeAuditLog.findAndCountAll({
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
