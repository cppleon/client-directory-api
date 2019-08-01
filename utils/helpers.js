module.exports = {
  /**
   * Generates sort object
   *
   * @param {string} sortParams
   * @param {string[]} allowedSortProperties
   * @param {*} defaultSort
   */
  generateSortQuery (
    sortParams,
    allowedSortProperties,
    defaultSort = { createdAt: -1 }
  ) {
    const sort = {}
    const sortValues = {
      asc: 1,
      desc: -1
    }

    if (sortParams && sortParams.length) {
      sortParams.split(',').forEach((param) => {
        const parts = param.split(':')
        const property = parts[0]

        if (allowedSortProperties.indexOf(property) > -1) {
          const direction = parts[1].toLowerCase()
          sort[property] = sortValues[direction] || sortValues.asc
        }
      })
    }

    return Object.keys(sort).length ? sort : defaultSort
  }
}
