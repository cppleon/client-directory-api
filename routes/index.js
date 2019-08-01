const express = require('express')

const router = express.Router()

// Clients
router.use('/clients', require('./clients'))

module.exports = router
