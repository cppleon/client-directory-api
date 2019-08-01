const moment = require('moment')

const PAGING_LIMIT_MAX = 50
const PAGING_LIMIT_DEFAULT = 10

module.exports = {
  // parseInt attempts to parse the value to an integer
  // it returns a special "NaN" value when it is Not a Number.
  normalizePaging (req, res, next) {
    let { skip, limit } = req.query

    skip = parseInt(skip, 10)

    if (isNaN(skip) || skip < 0) {
      skip = 0
    }

    req.query.skip = skip

    limit = parseInt(limit, 10)

    if (isNaN(limit)) {
      limit = PAGING_LIMIT_DEFAULT
    } else if (limit > PAGING_LIMIT_MAX) {
      limit = PAGING_LIMIT_MAX
    } else if (limit < 1) {
      limit = 1
    }

    req.query.limit = limit

    next()
  },

  validateDateRange (req, res, next) {
    const { dateFrom, dateTo } = req.query

    if (dateFrom && !moment(dateFrom).isValid()) {
      // console.warn(`Invalid "dateFrom": ${dateFrom}`)
      const error = new Error(`Invalid "dateFrom": ${dateFrom}`)
      return next(error)
    }

    if (dateTo && !moment(dateTo).isValid()) {
      // console.warn(`Invalid "dateTo": ${dateTo}`)
      const error = new Error(`Invalid "dateTo": ${dateTo}`)
      return next(error)
    }

    next()
  }
}
