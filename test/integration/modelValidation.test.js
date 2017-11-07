const should = require('should')
const app = require('loopback')
const { yup } = require('../../index')
const AdvancedValidation = require('../../lib/lyvMixin')
const schema = require('../support/schema')
const data = require('../support/data')

// https://github.com/strongloop/loopback-boot/blob/master/lib/executor.js#L57-L71
// the loopback-boot module patches in the loopback attribute so we can assume the same
app.loopback = require('loopback')

const dataSource = app.createDataSource({
  connector: app.Memory,
})

app.loopback.modelBuilder.mixins.define('AdvancedValidation', AdvancedValidation)

describe('loopback datasource validation', () => {
  it('validation should fail', done => {
    const Book = dataSource.createModel('Book', {}, { mixins: { AdvancedValidation: {} } })
    Book.registerSchema(schema)
    Book.create(data)
      .then(book => {
        throw new Error('you shouldn\'t get here')
      })
      .catch(err => {
        err.should.not.be.Undefined()
        done()
      })
  })

  it('validation should succeed', done => {
    const Book = dataSource.createModel('Book', {
      name: String,
      favouriteNumber: Number,
    }, { mixins: { AdvancedValidation: {} } })

    Book.registerSchema(
      yup.object().shape({
        name: yup.string(),
        externalMongoId: yup.objectId(),
        favouriteNumber: yup.number().required(),
        type: yup.string(),
      }),
    )

    const manData = {
      name: 'Piero',
      favouriteNumber: '10',
      externalMongoId: '59f1a8946d4cd000101c73da',
    }
    Book.create(manData)
      .then(book => {
        const theBook = book.toObject()
        theBook.should.have.property('name').eql(manData.name)
        theBook.should.have.property('favouriteNumber').eql(10)
        done()
      })
  })

  it('partial update validation should succeed', async () => {
    const Book = dataSource.createModel('Book', {
      name: String,
      favouriteNumber: Number,
    }, { mixins: { AdvancedValidation: {} } })

    Book.registerSchema(
      yup.object().shape({
        name: yup.string().required(),
        favouriteNumber: yup.number().required(),
        type: yup.string(),
      }),
    )

    const manData = { name: 'Piero', favouriteNumber: '10' }
    const book = await Book.create(manData)
    await Book.updateAll({ name: 'Piero' }, { type: 'a new book' })
  })

  it('partial update validation using model instance should fail', async () => {
    const Book = dataSource.createModel('Book', {
      name: String,
      favouriteNumber: Number,
    }, { mixins: { AdvancedValidation: {} } })

    Book.registerSchema(
      yup.object().shape({
        name: yup.string().required(),
        favouriteNumber: yup.number().required(),
        type: yup.string(),
      }),
    )

    const manData = { name: 'Piero', favouriteNumber: '10' }
    const book = await Book.create(manData)
    book.name = undefined
    try {
      await book.save()
    } catch (err) {
      err.constructor.name.should.be.equal('ValidationError')
    }
  })
})
