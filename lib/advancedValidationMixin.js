const yup = require('yup')
const _ = require('lodash')
const debug = require('debug')('AdvancedValidation')


module.exports = (Model, schema = {}) => {
  const defaultOptions = { beforeSaveHook: true }
  const defaultValidationOptions = { abortEarly: false, stripUnknown: true }

  function registerBeforeSaveHook(Model, validationOptions) {
    Model.observe('persist', (ctx, next) => {
      let data
      let performPartialValidation = false
      if (ctx.currentInstance) {
        data = ctx.currentInstance.toObject()
      } else {
        data = ctx.data
        performPartialValidation = true
      }

      return Model.advancedValidate(data, validationOptions, performPartialValidation)
        .then((validatedData) => {
          debug('validation passed %O', validatedData)
          _.merge(data, validatedData)
          ctx.data = validatedData
          return next()
        })
        .catch((err) => {
          debug('validation failed %O', err)
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
      registerBeforeSaveHook(Model, schema, validationOptions)
    }
  }

  Model.getAdvancedValidationSchema = function () {
    return this.definition.settings.validation.schema
  }
}
