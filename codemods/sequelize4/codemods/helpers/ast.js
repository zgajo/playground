module.exports = {
  /**
   *
   * @param {*} key example: db (that is an object)
   * @returns object that will search places of found @key
   */
  preparedObjectUsageSearch: (key) => ({
    object: {
      type: 'MemberExpression',
      object: {
        name: key,
      },
    },
  }),
  /**
   *
   * @param {*} key example: db (that is an object)
   * @returns object that will search destructred variables from the @key
   */
  preparedDestructureObjectUsageSearch: (key) => ({
    id: {
      type: 'ObjectPattern',
    },
    init: {
      object: { name: key },
    },
  }),
};
