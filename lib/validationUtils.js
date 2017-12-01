const Promise = require('bluebird')
const _ = require('lodash')

const defaultOptions = { abortEarly: false, stripUnknown: true }

const validateRemoteMethodHook = (schema, opts) => (ctx, hookState, next) => {
  const args = ctx.args
  const argsKeys = Object.keys(args)

  const options = _.defaultsDeep({}, defaultOptions, opts)

  Promise
    .reduce(argsKeys, async (acc, key) => {
      if (schema[key] && schema[key].validate) {
        acc[key] = await schema[key].validate(args[key], options)
      } else {
        acc[key] = args[key]
      }
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
