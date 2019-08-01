const async = require('async')
const mongoose = require('mongoose')
const flatten = require('flatten-obj')()
const createError = require('http-errors')
const Client = require('../models/Client')
const Account = require('../models/Account')
const Helpers = require('../utils/helpers')

async function deleteClient (id) {
  const session = await mongoose.startSession()

  session.startTransaction()

  const accountUpdate = {
    $set: { status: 0 }
  }

  const clientUpdate = {
    deletedAt: new Date()
  }

  try {
    await Account.updateMany({ client: id }, accountUpdate)
    return await Client.findByIdAndUpdate(id, clientUpdate, { new: true })
  } catch (e) {
    await session.abortTransaction()
    session.endSession()
    throw e
  }
}

module.exports = {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  index (req, res, next) {
    const { skip, limit,
      sort: sortParams } = req.query

    const sort = Helpers.generateSortQuery(sortParams, ['firstName', 'lastName', 'gender'])

    const conditions = {
      deletedAt: { $exists: false }
    }

    async.parallel({
      docs (cb) {
        Client.find(conditions)
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .exec(cb)
      },

      count (cb) {
        Client.count(conditions, cb)
      }
    }, (err, results) => {
      if (err) {
        next(err)
        return
      }

      res.jsend.success({
        items: results.docs,
        totalCount: results.count
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
    const { id } = req.params

    const conditions = {
      _id: id,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${id}"`))
        return
      }

      res.jsend.success(doc)
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  create (req, res, next) {
    const client = new Client(req.validationResult)

    client.save((err, doc) => {
      if (err) {
        next(err)
        return
      }

      res.jsend.success(doc)
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  update (req, res, next) {
    const { id } = req.params

    const conditions = {
      _id: id,
      deletedAt: { $exists: false }
    }

    const update = {
      $set: flatten(req.validationResult)
    }

    Client.findOneAndUpdate(conditions, update, { new: true }, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${id}"`))
        return
      }

      res.jsend.success(doc)
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete (req, res, next) {
    const { id } = req.params

    const conditions = {
      _id: id,
      deletedAt: { $exists: false }
    }

    Client.findOne(conditions, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      if (!doc) {
        next(createError(404, `Client not found: "${id}"`))
        return
      }

      deleteClient(id)
        .then((doc) => res.jsend.success(doc))
        .catch((err) => next(err))
    })
  }
}
