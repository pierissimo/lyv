const yup = require('yup');
const _ = require('lodash');
const debug = require('debug')('AdvancedValidation');


module.exports = (Model, schema = {}) => {
  const defaultOptions = { beforeSaveHook: true };
  const defaultValidationOptions = { abortEarly: false, stripUnknown: true };

  function registerBeforeSaveHook(Model, validationOptions) {
    Model.observe('before save', (ctx, next) => {
      let data;
      if (ctx.instance) {
        data = ctx.instance.toObject();
        debug('%s before update: %O', ctx.Model.modelName, data);
      } else {
        data = ctx.data;
        debug('%s before save %O', ctx.Model.modelName, data);
      }

      return Model.advancedValidate(data, validationOptions)
        .then((validatedData) => {
          debug('validation passed %O', validatedData);
          _.merge(data, validatedData);
          if (ctx.instance) {
            ctx.instance = new Model(validatedData);
          } else {
            ctx.data = validatedData;
          }
          return next();
        })
        .catch((err) => {
          debug('validation failed %O', err);
          return next(err);
        });
    });
  }


  Model.advancedValidate = function (data, validationOpts) {
    const schema = this.definition.settings.validation.schema;
    if (!schema) throw Error('advanced validation schema not set');
    const validationOptions = _.defaultsDeep(
      {},
      this.definition.settings.validation.validationOptions,
      validationOpts
    );

    return schema.validate(data, validationOptions);
  };

  Model.registerSchema = function (schema, opts, validationOptions) {
    const options = _.defaultsDeep({}, defaultOptions, opts);
    this.definition.settings.validation = {
      schema,
      validationOptions: _.defaultsDeep({}, defaultValidationOptions, validationOptions)
    };


    if (options.beforeSaveHook) {
      registerBeforeSaveHook(Model, schema, validationOptions);
    }
  };

  Model.getAdvancedValidationSchema = function () {
    return this.definition.settings.validation.schema;
  };
};
