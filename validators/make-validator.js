module.exports = makeValidator

function makeValidator (Joi, schema) {
  function validate (req) {
    return Joi.validate(req.body, schema)
  }

  validate.middleware = middleware

  function middleware (req, res, next) {
    const { error, value } = validate(req)
    req.validationResult = value
    next(error)
  }

  return validate
}
