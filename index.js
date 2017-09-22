const AdvancedValidation = require('./lib/advancedValidationMixin');

module.exports = app => {
  app.loopback.modelBuilder.mixins.define('AdvancedValidation', AdvancedValidation);
};
