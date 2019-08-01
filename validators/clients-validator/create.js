const Joi = require('@hapi/joi')
const makeValidator = require('../make-validator')

const schema = Joi.object().options({
  abortEarly: false,
  allowUnknown: true
}).keys({
  pid: Joi.string()
    .regex(/^\d{11}$/)
    .required(),

  firstName: Joi.string()
    .min(2).max(50)
    .required(),

  lastName: Joi.string()
    .min(2).max(50)
    .required(),

  gender: Joi.string()
    .valid('M', 'F')
    .required(),

  phoneNumber: Joi.string()
    .regex(/^5[0-9]{8}$/)
    .required(),

  pictureFileId: Joi.string(),

  address: Joi.object()
    .required().keys({
      legal: Joi.object()
        .required().keys({
          country: Joi.string()
            .required(),

          city: Joi.string()
            .required(),

          address: Joi.string()
            .required()
        }),

      physical: Joi.object()
        .required().keys({
          country: Joi.string()
            .required(),

          city: Joi.string()
            .required(),

          address: Joi.string()
            .required()
        })
    })
})

module.exports = makeValidator(Joi, schema)
