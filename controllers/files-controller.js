const fs = require('fs')
const createError = require('http-errors')
const File = require('../models/File')

module.exports = {
  get (req, res, next) {
    const { id } = req.params

    File.findById(id, (err, doc) => {
      if (err) {
        next(err)
        return
      }

      const filePath = `uploads/${doc._id}`

      if (!fs.existsSync(filePath)) {
        next(createError(404, 'File not found'))
        return
      }

      const readStream = fs.createReadStream(`uploads/${doc._id}`)
      // Be careful of special characters

      const filename = encodeURIComponent(doc.originalname)
      // Ideally this should strip them

      res.setHeader('Content-disposition', `inline; filename="${filename}"`)
      res.setHeader('Content-type', doc.mimetype)

      readStream.pipe(res)
    })
  },

  upload (req, res, next) {
    new File(req.file).save((err, doc) => {
      if (err) {
        next(err)
        return
      }

      fs.rename(req.file.path, `uploads/${doc._id}`, (err) => {
        if (err) {
          next(err)
          doc.remove()
          return
        }

        res.jsend.success(doc)
      })
    })
  }
}
