const express = require('express')
const multer = require('multer')

const FilesController = require('../controllers/files-controller')

const router = express.Router()
const upload = multer({ dest: 'temp/' })

router.get('/:id', FilesController.get)
router.post('/',
  upload.single('file'),
  FilesController.upload)

module.exports = router
