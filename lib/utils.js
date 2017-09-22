const Promise = require('bluebird');
const _ = require('lodash');

const defaultOptions = { abortEarly: false, stripUnknown: true };

const validateRemoteMethod = (schemas, opts) => (...args) => {
  const argsSchemas = Array.isArray(schemas) ? schemas : [schemas];

  const options = _.defaultsDeep({}, defaultOptions, opts);

  return Promise
    .map(argsSchemas, (schema, index) => schema.validate(args[index], options))
    .catch(err => {
      err.statusCode = 400;
      throw err;
    });
};

module.exports = { validateRemoteMethod };
