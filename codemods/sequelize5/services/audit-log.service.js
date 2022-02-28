const _ = require("lodash")

class AuditLog {
  static prepareHook(name, userIdColumn, excludedFields) {
    return (row, opts) => {
      // Create an array of changed field names
      let changedFields = []

      for (let field of row.changed()) {
        if (excludedFields.indexOf(field) !== -1) {
          continue
        }

        // Sequelize is bad with JSONB/JSON Postgresql fields, that's why we do this. (UserAppSettings->interest_in_cel_per_coin)
        if (_.isEqual(row.dataValues[field], row._previousDataValues[field])) {
          continue
        }

        changedFields.push(field)
      }

      const newValue = _.pick(row.dataValues, changedFields)
      const oldValue = _.pick(row._previousDataValues, changedFields)

      // If there are no keys in either Object, dismiss.
      if (!(Object.keys(newValue).length + Object.keys(oldValue).length)) {
        return
      }

      const sequelize = row.sequelize

      return sequelize.models.AuditLog.create({
        user_id: row.dataValues[userIdColumn],
        name,
        new_value: newValue,
        old_value: oldValue,
      }, { transaction: opts.transaction })
    }
  }

  static audit(Model, name, userIdColumn = "user_id", excludedFields = ["created_at", "updated_at"]) {
    excludedFields = _.uniq([...excludedFields, "created_at", "updated_at"])

    const hook = this.prepareHook(name, userIdColumn, excludedFields)

    Model.afterSave(hook)
    Model.afterUpsert(hook)
    Model.afterDestroy(hook)
  }
}

module.exports = AuditLog
