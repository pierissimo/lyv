const yup = require('yup')
const types = require('./types')

module.exports = yup
module.exports = { ...yup, ...types }
