const Promise = require('bluebird')
const _ = require('lodash')

const defaultOptions = { abortEarly: false, stripUnknown: true }

const validateRemoteMethodHook = (schema, opts) => (ctx, hookState, next) => {
  const args = ctx.args
  const schemaKeys = Object.keys(schema)

  const options = _.defaultsDeep({}, defaultOptions, opts)

  Promise
    .reduce(schemaKeys, async (acc, key) => {
      acc[key] = await schema[key].validate(args[key], options)
      return acc
    }, {})
    .then((newArgs) => {
      ctx.args = newArgs
      next()
    })
    .catch((err) => {
      err.statusCode = 400
      next(err)
    })
}

module.exports = { validateRemoteMethodHook }
