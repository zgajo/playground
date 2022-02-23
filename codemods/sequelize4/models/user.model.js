const _ = require("lodash")

const AuditLogService = require('../services/audit-log.service');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      auth0_user_id: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },

      country: {
        type: Sequelize.STRING,
      },
    },
    {
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'users',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );

  User.beforeDestroy((instance, options) => {
    return instance.update(
      {
        deleted_ident_values: {
          auth0_user_id: instance.auth0_user_id,
          email: instance.email,
        },
        auth0_user_id: null,
        email: null,
      },
      {
        transaction: options.transaction,
      }
    );
  });

  User.afterDestroy((instance, options) => {
    if (instance.deleted_ident_values.auth0_user_id) {
      return sequelize.models.Task.myCreate(
        {
          task_type: 'auth0',
          data_type: 'remove',
          data_id: instance.deleted_ident_values.auth0_user_id,
        },
        options
      );
    }
  });

  User.afterSave((instance, options) => {
    const tasks = [];

    if (instance.changed('country')) {
      tasks.push(
        sequelize.models.Task.myCreate(
          {
            task_type: 'event',
            data_type: 'user-residency-changed',
            data_id: instance.id,
          },
          { transaction: options.transaction }
        )
      );

      return Promise.all(tasks);
    }
  });

  User.associate = function (models) {
    models.User.hasOne(models.UserProfile, {
      foreignKey: 'user_id',
      as: 'profile',
    });
  };

  User.prototype.toJSON = function () {
    let out = _.clone(
      this.get({
        plain: true,
      })
    );

    return out;
  };

  AuditLogService.audit(User, 'user', 'id', [
    'latest_user_access_log_id',
    'session_invalid_before',
  ]);

  return User;
};
