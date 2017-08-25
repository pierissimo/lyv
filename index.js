const AdvancedValidation = require('./lib/AdvancedValidation');

module.exports = app => {
	app.loopback.modelBuilder.mixins.define('AdvancedValidation', AdvancedValidation);
};
