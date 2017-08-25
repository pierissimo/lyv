const Ajv = require('ajv');
const setupAsync = require('ajv-async');
const _ = require('lodash');
const debug = require('debug')('AdvancedValidation');


module.exports = (Model, schema = {}) => {
	const ajv = setupAsync(new Ajv({
		coerceTypes: true,
		allErrors: true,
		errorDataPath: 'property'
	}));

	const schemaCopy = _.cloneDeep(Model.definition.settings.validationSchema);
	schemaCopy.$async = true;
	Model.advancedValidateSchema = schemaCopy;
	Model.advancedValidate = ajv.compile(schemaCopy);

	Model.observe('before save', (ctx, next) => {
		let data;
		if (ctx.instance) {
			data = ctx.instance.toObject();
			debug('%s before update: %O', ctx.Model.modelName, data);
		} else {
			data = ctx.data;
			debug('%s before save %O', ctx.Model.modelName, data);
		}

		return Model.advancedValidate(data)
			.then(data => {
				debug('validation passed %O', data);
				next();
			})
			.catch(err => {
				debug('validation failed %O', err);
				next(err);
			});
	});
};
