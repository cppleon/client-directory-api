const Joi = require('@hapi/joi')
const makeValidator = require('../make-validator')

const schema = Joi.object().options({
  abortEarly: false,
  allowUnknown: false
}).keys({
  pid: Joi.string()
    .regex(/^\d{11}$/),

  firstName: Joi.string()
    .min(2).max(50),

  lastName: Joi.string()
    .min(2).max(50),

  gender: Joi.string()
    .valid('M', 'F'),

  phoneNumber: Joi.string()
    .regex(/^5[0-9]{8}$/),

  pictureFileId: Joi.string(),

  address: Joi.object().keys({
    legal: Joi.object().keys({
      country: Joi.string(),

      city: Joi.string(),

      address: Joi.string()
    }),

    physical: Joi.object().keys({
      country: Joi.string(),

      city: Joi.string(),

      address: Joi.string()
    })
  })
})

module.exports = makeValidator(Joi, schema)
