"use strict"
const _ = require("lodash")

const TASK_PRIORITY = {
  CRITICAL: 1,
  HIGH: 50,
  NORMAL: 100,
  LOW: 500,
  LOWEST: 999,
}
module.exports = (sequelize, Sequelize) => {
  let Task = sequelize.define(
    "Task",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      task_type: {
        type: Sequelize.STRING(64),
        unique: "task_ident",
      },
      data_type: {
        type: Sequelize.STRING(64),
        unique: "task_ident",
      },
      data_id: {
        type: Sequelize.STRING(64),
        unique: "task_ident",
      },
      info_1: {
        type: Sequelize.TEXT,
      },
      info_2: {
        type: Sequelize.TEXT,
      },
      retries: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: false,
      updatedAt: "ts_changed",
      paranoid: false,
      freezeTableName: true,
      tableName: "tasks",
      version: true,
      charset: "utf8",
      collate: "utf8_unicode_ci",
    },
  )

  Task.prototype.fail = async function () {
    await this.increment("retries")
    return this.save()
  }

  Task.prototype.done = async function () {
    return Task.sequelize.query(
      "DELETE FROM tasks WHERE id = :id AND version = :version ",
      {
        replacements: {
          id: this.id,
          version: this.version,
        },
        type: Task.sequelize.QueryTypes.DELETE,
      }
    )
    // return this.destroy()
  }

  Task.priority2value = function (priority) {
    let ts_changed

    switch (priority) {
      case TASK_PRIORITY.CRITICAL:
        ts_changed = new Date(Date.now() - 30 * 86400 * 1000)
        break
      case TASK_PRIORITY.HIGH:
        ts_changed = new Date(Date.now() - 1 * 86400 * 1000) // -1 day
        break
      case TASK_PRIORITY.LOW:
        ts_changed = new Date(Date.now() + 1 * 86400 * 1000) // +1 day
        break
      case TASK_PRIORITY.LOWEST:
        ts_changed = new Date(Date.now() + 30 * 86400 * 1000) // +30 days
        break
      default:
        ts_changed = new Date()
    }

    return ts_changed
  }

  Task.myCreate = async function (values, options) {
    let criteria = _.pick(values, ["id", "task_type", "data_type", "data_id"])
    let transactionIdent
    let transactionAutoOpened = false
    if (options && options.transaction) {
      transactionIdent = options.transaction
    } else {
      transactionIdent = await sequelize.transaction()
      transactionAutoOpened = true
    }
    if (values.task_type === "analytics" && !values.priority) {
      values.priority = TASK_PRIORITY.LOWEST
    }
    if (values.priority) {
      values.ts_changed = Task.priority2value(values.priority)
      delete values.priority
    }
    return Task.findOrCreate({
      where: criteria,
      defaults: values,
      transaction: transactionIdent,
    })
      .spread(row => {
        let data = Object.assign(values, { retries: 0 })
        row.set(data)

        return row
          .save({
            transaction: transactionIdent,
          })
          .then(row => {
            if (data.ts_changed) {
              return Task.sequelize.query(
                "UPDATE tasks SET ts_changed = :updatedAt, version = version + 1 WHERE id = :id",
                {
                  replacements: {
                    id: row.id,
                    updatedAt: data.ts_changed,
                  },
                  transaction: transactionIdent,
                  type: Task.sequelize.QueryTypes.UPDATE,
                }
              ).then(() => {
                return Task.findOne({
                  where: {
                    id: row.id,
                  },
                  transaction: transactionIdent,
                })
              })
            }
            return row
          })
      })
      .then(task => {
        if (transactionAutoOpened) {
          transactionIdent.commit()
        }
        return task
      })
      .catch(err => {
        if (transactionAutoOpened) {
          transactionIdent.rollback()
        }
        throw err
      })
  }

  return Task
}
