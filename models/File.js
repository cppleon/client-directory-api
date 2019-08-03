const mongoose = require('mongoose')
const Schema = mongoose.Schema

const definition = {
  size: { type: Number },
  originalname: { type: String },
  mimetype: { type: String }
}

const options = {
  timestamps: true,
  collection: 'files'
}

const fileSchema = new Schema(definition, options)

module.exports = mongoose.model('File', fileSchema)
