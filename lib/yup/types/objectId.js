const MixedSchema = require('yup').mixed
const _ = require('lodash')

class ObjectIdSchemaType extends MixedSchema {
  constructor() {
    super()
    try {
      this.ObjectID = require('mongodb').ObjectID
    } catch (err) {
      throw new Error('required dependency "mongodb" seems not to be installed')
    }
    this.withMutation(() => {
      this.transform((value, originalValue) => {
        if (this.isType(value)) {
          return new this.ObjectID(value)
        }
        return originalValue
      })
    })
  }

  _typeCheck(value) {
    try {
      return this.ObjectID.isValid(value)
    } catch (err) {
      return false
    }
  }
}

module.exports = opts => new ObjectIdSchemaType(opts)
