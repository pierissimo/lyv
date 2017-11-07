const yup = require('yup')

const model = (ModelClass) => {
  if (ModelClass.name !== 'ModelConstructor') {
    throw new Error('Invalid model')
  }

  return yup.lazy(() => ModelClass.getAdvancedValidationSchema())
}

module.exports = model
