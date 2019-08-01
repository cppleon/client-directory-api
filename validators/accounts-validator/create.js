const Joi = require('@hapi/joi')
const makeValidator = require('../make-validator')

const schema = Joi.object().options({
  abortEarly: false,
  allowUnknown: true
}).keys({
  type: Joi.number()
    .valid(1, 2, 3)
    .required(),

  currency: Joi.string()
    .valid('GEL', 'USD', 'EUR', 'RUB')
    .required()
})

module.exports = makeValidator(Joi, schema)
