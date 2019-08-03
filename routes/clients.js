const express = require('express')

// Validators
const ClientsValidator = require('../validators/clients-validator')
const AccountsValidator = require('../validators/accounts-validator')

// Controllers
const ClientsController = require('../controllers/clients-controller')
const AccountsController = require('../controllers/accounts-controller')

// Middlewares
const QueryParamsMiddleware = require('../middlewares/query-params-middleware')

const router = express.Router()

router.get('/',
  QueryParamsMiddleware.normalizePaging,
  ClientsController.index)

router.get('/counts', ClientsController.getCounts)
router.get('/:id', ClientsController.get)

router.post('/',
  ClientsValidator.create.middleware,
  ClientsController.create)

router.put('/:id',
  ClientsValidator.update.middleware,
  ClientsController.update)

router.delete('/:id', ClientsController.delete)

// Accounts
router.get('/:clientId/accounts', AccountsController.index)

router.get('/:clientId/accounts/:id', AccountsController.get)

router.post('/:clientId/accounts/',
  AccountsValidator.create.middleware,
  AccountsController.create)

router.put('/:clientId/accounts/:id',
  AccountsValidator.update.middleware,
  AccountsController.update)

router.delete('/:clientId/accounts/:id', AccountsController.delete)

module.exports = router
