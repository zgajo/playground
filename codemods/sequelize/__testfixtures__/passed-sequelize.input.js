module.exports = {
  findAllAndCountAuditLogsForInstance: async function (
    instanceId,
    modelNames,
    pagination,
    sequelize
  ) {
    return sequelize.models.BackofficeAuditLog.findAndCount({
      where: {
        instance_id: instanceId,
        model_name: {
          [sequelize.Op.in]: modelNames,
        },
      },
      offset: pagination.offset,
      limit: pagination.limit,
      order: [['date', 'DESC']],
    });
  },
};
