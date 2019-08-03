module.exports = {
  /**
   * Generates sort object
   *
   * @param {any[]} sortParams
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

    if (sortParams && Object.keys(sortParams).length) {
      for (const key in sortParams) {
        if (Object.prototype.hasOwnProperty.call(sortParams, key)) {
          if (allowedSortProperties.indexOf(key) > -1) {
            const direction = sortParams[key].toLowerCase()
            sort[key] = sortValues[direction] || sortValues.asc
          }
        }
      }
    }

    // sortParams = decodeURIComponent(sortParams)

    // if (sortParams && sortParams.length) {
    //   sortParams.split(',').forEach((param) => {
    //     const parts = param.split(':')
    //     const property = parts[0]

    //     if (allowedSortProperties.indexOf(property) > -1) {
    //       const direction = parts[1].toLowerCase()
    //       sort[property] = sortValues[direction] || sortValues.asc
    //     }
    //   })
    // }

    return Object.keys(sort).length ? sort : defaultSort
  }
}
