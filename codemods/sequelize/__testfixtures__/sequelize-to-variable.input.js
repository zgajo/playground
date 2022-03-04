module.exports = {
  findAllAndCountAuditLogsForInstance: async function (
    instanceId,
    modelNames,
    pagination,
    row
  ) {
    const banana = row.sequelize;

    return banana.models.BackofficeAuditLog.findAndCount({
      where: {
        instance_id: instanceId,
        model_name: {
          [banana.Op.in]: modelNames,
        },
      },
      offset: pagination.offset,
      limit: pagination.limit,
      order: [['date', 'DESC']],
    });
  },
};
