const flatten = require('flatten-obj')()
const createError = require('http-errors')
const Client = require('../models/Client')
const Account = require('../models/Account')
const Helpers = require('../utils/helpers')

module.exports = {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  index (req, res, next) {
    const { clientId } = req.params

    const conditions = {
      _id: clientId,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${clientId}"`))
        return
      }

      const { sort: sortParams } = req.query

      const sort = Helpers.generateSortQuery(sortParams, ['type', 'currency', 'status'])

      Account.find({ client: clientId }).sort(sort).exec((err, docs) => {
        if (err) {
          next(err)
          return
        }

        res.jsend.success(docs)
      })
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  get (req, res, next) {
    const { id, clientId } = req.params

    const conditions = {
      _id: clientId,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${clientId}"`))
        return
      }

      Account.findOne({ _id: id, client: clientId }, (err, doc) => {
        if (err) {
          next(err)
          return
        }

        if (!doc) {
          next(createError(404, `Account not found: "${id}"`))
          return
        }

        res.jsend.success(doc)
      })
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  create (req, res, next) {
    const { clientId } = req.params

    const conditions = {
      _id: clientId,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${clientId}"`))
        return
      }

      const account = new Account({
        ...req.validationResult,
        client: clientId
      })

      account.save((err, doc) => {
        if (err) {
          next(err)
          return
        }

        res.jsend.success(doc)
      })
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  update (req, res, next) {
    const { id, clientId } = req.params

    const conditions = {
      _id: clientId,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${clientId}"`))
        return
      }

      const update = {
        $set: flatten(req.validationResult)
      }

      Account.findOneAndUpdate({ _id: id, client: clientId }, update, { new: true }, (err, doc) => {
        if (err) {
          next(err)
          return
        }

        if (!doc) {
          next(createError(404, `Account not found: "${id}"`))
          return
        }

        res.jsend.success(doc)
      })
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete (req, res, next) {
    const { id, clientId } = req.params

    const conditions = {
      _id: clientId,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${clientId}"`))
        return
      }

      const update = {
        $set: { status: 0 }
      }

      Account.findOneAndUpdate({ _id: id, client: clientId }, update, { new: true }, (err, doc) => {
        if (err) {
          next(err)
          return
        }

        if (!doc) {
          next(createError(404, `Account not found: "${id}"`))
          return
        }

        res.jsend.success(doc)
      })
    })
  }
}
