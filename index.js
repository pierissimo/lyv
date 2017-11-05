const AdvancedValidation = require('./lib/lyvMixin')
const { validateRemoteMethodHook } = require('./lib/validationUtils')

module.exports = (app) => {
  app.loopback.modelBuilder.mixins.define('AdvancedValidation', AdvancedValidation)
}

module.exports.validateRemoteMethodHook = validateRemoteMethodHook
