const AdvancedValidation = require('./lib/advancedValidationMixin')
const { validateRemoteMethodHook } = require('./lib/validationUtils')

module.exports = (app) => {
  app.loopback.modelBuilder.mixins.define('AdvancedValidation', AdvancedValidation)
}

module.exports.validateRemoteMethodHook = validateRemoteMethodHook
