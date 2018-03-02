const yup = require('yup')

const model = (ModelClass) => yup.lazy(() => ModelClass.getAdvancedValidationSchema())

module.exports = model
