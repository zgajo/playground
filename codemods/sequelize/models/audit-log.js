module.exports = (sequelize, Sequelize) => {
  const AuditLog = sequelize.define("AuditLog", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
    old_value: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    new_value: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
  }, {
    underscored: true,
    timestamps: false,
    paranoid: false,
    freezeTableName: true,
    tableName: "audit_logs",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  })

  return AuditLog
}
