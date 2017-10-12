const yup = require('yup')
const _ = require('lodash')
const debug = require('debug')('AdvancedValidation')


module.exports = (Model, schema = {}) => {
  const defaultOptions = { beforeSaveHook: true }
  const defaultValidationOptions = { abortEarly: false, stripUnknown: true }

  function registerBeforeSaveHook(Model, validationOptions) {
    Model.observe('before save', async (ctx, next) => {
      if (ctx.options && ctx.options.validate === false) return next()
      let data
      let performPartialValidation = false
      if (ctx.currentInstance) {
        data = ctx.data
        performPartialValidation = true
      } else if (ctx.isNewInstance || ctx.instance) {
        data = ctx.instance.toObject()
      } else if (ctx.where) { //updateAll?
        performPartialValidation = true
        data = ctx.data
      } else {
        data = ctx.data
      }

      return Model.advancedValidate(data, validationOptions, performPartialValidation)
        .then((validatedData) => {
          debug('validation passed %O', validatedData)
          ctx.data = validatedData
          return next()
        })
        .catch((err) => {
          debug('validation failed %O', err)
          err.statusCode = 400
          return next(err)
        })
    })
  }

  function getPartialSchema(schema, data) {
    return yup.object().shape(_.pick(schema.fields, _.keys(data)))
  }

  Model.advancedValidate = function (data, validationOpts, isPartialValidation) {
    const modelSchema = this.getAdvancedValidationSchema()
    const schema = isPartialValidation ? getPartialSchema(modelSchema, data) : modelSchema

    if (!schema) throw Error('advanced validation schema not set')
    const validationOptions = _.defaultsDeep(
      {},
      this.definition.settings.validation.validationOptions,
      validationOpts,
    )

    return schema.validate(data, validationOptions)
  }

  Model.registerSchema = function (schema, opts, validationOptions) {
    const options = _.defaultsDeep({}, defaultOptions, opts)
    this.definition.settings.validation = {
      schema,
      validationOptions: _.defaultsDeep({}, defaultValidationOptions, validationOptions),
    }


    if (options.beforeSaveHook) {
      registerBeforeSaveHook(Model, validationOptions)
    }
  }

  Model.getAdvancedValidationSchema = function () {
    return this.definition.settings.validation.schema
  }
}
