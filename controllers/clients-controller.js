const async = require('async')
const mongoose = require('mongoose')
const flatten = require('flatten-obj')()
const createError = require('http-errors')
const Client = require('../models/Client')
const Account = require('../models/Account')
const Helpers = require('../utils/helpers')

async function deleteClientAndCloseAccounts (id) {
  const session = await mongoose.startSession()

  session.startTransaction()

  try {
    const accountUpdate = {
      $set: { status: 0 }
    }

    await Account.updateMany({ client: id }, accountUpdate)

    const clientUpdate = {
      deletedAt: new Date()
    }

    const client = await Client.findByIdAndUpdate(id, clientUpdate, { new: true })

    await session.commitTransaction()
    session.endSession()
    return client
  } catch (e) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction()
    session.endSession()
    throw e // Rethrow so calling function sees error
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
    const conditions = {}

    const { q, status } = req.query

    switch (status) {
      case '0':
        conditions.$and = [{
          deletedAt: { $exists: true }
        }]
        break
      case '1':
        conditions.$and = [{
          deletedAt: { $exists: false }
        }]
        break
    }

    if (q && q.length) {
      const pattern = q.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')

      const fieldsToMatch = ['pid', 'firstName', 'lastName', 'phoneNumber']

      const or = fieldsToMatch.map((field) => {
        return { [field]: new RegExp(`${pattern}`, 'i') }
      })

      if (!conditions.$and) {
        conditions.$and = [{ $or: or }]
      } else {
        conditions.$and.push({ $or: or })
      }
    }

    async.parallel({
      docs (cb) {
        const { skip, limit,
          sort: sortParams } = req.query

        const sort = Helpers.generateSortQuery(sortParams, ['firstName', 'lastName', 'gender'])

        Client.find(conditions)
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .exec(cb)
      },

      totalCount (cb) {
        Client.countDocuments(conditions, cb)
      }
    }, (err, results) => {
      if (err) {
        next(err)
        return
      }

      res.jsend.success({
        items: results.docs,
        totalCount: results.totalCount
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

    const conditions = { _id: id }

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

  getCounts (req, res, next) {
    async.parallel({
      active (cb) {
        Client.countDocuments({
          deletedAt: { $exists: false }
        }, cb)
      },

      inactive (cb) {
        Client.countDocuments({
          deletedAt: { $exists: true }
        }, cb)
      },

      total (cb) {
        Client.estimatedDocumentCount(cb)
      }
    }, (err, results) => {
      if (err) {
        next(err)
        return
      }

      res.jsend.success({
        active: results.active,
        inactive: results.inactive,
        total: results.total
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
    const { pid,
      firstName,
      lastName,
      gender,
      phoneNumber,
      pictureFileId,
      address } = req.body

    const client = new Client({
      pid,
      firstName,
      lastName,
      gender,
      phoneNumber,
      pictureFileId,
      address
    })

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
    const { pid,
      firstName,
      lastName,
      gender,
      phoneNumber,
      pictureFileId,
      address } = req.body

    const conditions = { _id: id }

    const update = {
      $set: flatten({
        pid,
        firstName,
        lastName,
        gender,
        phoneNumber,
        pictureFileId,
        address
      })
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

      deleteClientAndCloseAccounts(id)
        .then((doc) => res.jsend.success(doc))
        .catch((err) => next(err))
    })
  }
}
