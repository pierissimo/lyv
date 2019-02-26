const Promise = require('bluebird')
const _ = require('lodash')

const defaultOptions = { abortEarly: false, stripUnknown: true }

const validateRemoteMethodHook = (schema, opts) => (ctx, hookState, next) => {
  const args = ctx.args
  const argsKeys = Object.keys(args)

  const options = _.defaultsDeep({}, defaultOptions, opts, {
    context: { ctx, hookState },
  })

  Promise.reduce(
    argsKeys,
    async (acc, key) => {
      if (schema[key] && schema[key].validate) {
        const label = (schema[key].describe() || [])['label']
        acc[key] = await schema[key].label(label || key).validate(args[key], options)
      } else {
        acc[key] = args[key]
      }
      return acc
    },
    {},
  )
    .then(newArgs => {
      ctx.args = newArgs
      next()
    })
    .catch(err => {
      err.statusCode = 400
      next(err)
    })
}

module.exports = { validateRemoteMethodHook }
