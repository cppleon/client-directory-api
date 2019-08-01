const mongoose = require('mongoose')
const Schema = mongoose.Schema

const definition = {
  pid: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F'], required: true },
  phoneNumber: { type: String, required: true },
  pictureFileId: { type: String },
  address: {
    legal: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true }
    },
    physical: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true }
    }
  },
  deletedAt: { type: Date }
}

const options = {
  timestamps: true,
  collection: 'clients'
}

const clientSchema = new Schema(definition, options)

clientSchema.index({ pid: 1 })

clientSchema.virtual('deleted').get(function () {
  return Boolean(this.deletedAt)
})

module.exports = mongoose.model('Client', clientSchema)
