const mongoose = require('mongoose')
const Schema = mongoose.Schema

const definition = {
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  type: {
    type: Number,
    enum: [1/* მიმდინარე */, 2/* შემნახველი */, 3/* დაგროვებითი */],
    required: true
  },
  currency: {
    type: String,
    enum: ['GEL', 'USD', 'EUR', 'RUB'],
    required: true
  },
  status: {
    type: Number,
    enum: [0 /* გახურული */, 1/* აქტიური */],
    required: true,
    default: 1
  }
}

const options = {
  timestamps: true,
  collection: 'accounts'
}

const accountSchema = new Schema(definition, options)

accountSchema.index({ pid: 1 })

module.exports = mongoose.model('Account', accountSchema)
