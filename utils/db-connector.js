const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const config = require('config')
const mongodbConfig = config.get('mongodb')

module.exports = {
  connect () {
    return mongoose.connect(mongodbConfig.uris, mongodbConfig.options).then(() => {
      const modelsPath = path.join(__dirname, '../models')

      fs.readdirSync(modelsPath).forEach((file) => {
        if (/.js$/.test(file)) {
          require(path.join(modelsPath, file))
        }
      })
    }).catch((err) => {
      console.log(`MongoDB connection error: ${err}`)
      process.exit(1)
    })
  },

  disconnect () {
    return mongoose.disconnect()
  }
}
