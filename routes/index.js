const express = require('express')

const router = express.Router()

router.use('/files', require('./files'))
router.use('/clients', require('./clients'))

module.exports = router
