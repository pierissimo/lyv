const should = require('should')
const yup = require('yup')
const { validateRemoteMethodHook } = require('../../lib/validationUtils')

describe('utils', () => {
  it('validateRemoteMethodHook function should validate remote method arguments and fail', done => {
    const ctx = {
      args: { book: { name1: 'piero' } },
    }

    const next = (err) => {
      err.inner[0].path.should.be.equal('name')
      err.inner[0].type.should.be.equal('required')
      done()
    }

    validateRemoteMethodHook({
      book: yup.object().shape({ name: yup.string().required() }),
    })(ctx, null, next)
  })
})
