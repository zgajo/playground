const AuditLogService = require("../services/audit-log.service")
const _ = require("lodash")

module.exports = (sequelize, Sequelize) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      external_id: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "Applicant ID",
      },

      external_service: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      external_response: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },

      middle_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      company_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },

      mothers_maiden_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      gender: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },


    },
    {
      underscored: true,
      timestamps: true,
      paranoid: false,
      freezeTableName: true,
      tableName: "user_profiles",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    },
  )

  UserProfile.afterSave(async (instance, options) => {
    let tasks = []

    if (
      instance.changed("state")
    ) {


      tasks.push(
        sequelize.models.Task.myCreate(
          {
            task_type: "event",
            data_type: "user-residency-changed",
            data_id: instance.user_id,
          },
          { transaction: options.transaction },
        ),
      )


      return Promise.all(tasks)
    }
  })

  UserProfile.associate = function (models) {
    models.UserProfile.belongsTo(models.User, {
      hooks: true,
      foreignKey: "user_id",
      targetKey: "id",
      as: "user",
    })
  }

  UserProfile.prototype.toJSON = function () {
    let out = _.clone(
      this.get({
        plain: true,
      }),
    )

    delete out.ssn

    return out
  }

  AuditLogService.audit(UserProfile, "user_profile")

  return UserProfile
}
