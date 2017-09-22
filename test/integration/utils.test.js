const should = require('should');
const yup = require('yup');
const { validateRemoteMethod } = require('../../lib/utils');

describe('utils', () => {
  it('validateRemoteMethod function should validate remote method arguments and fail', done => {
    const args = ['hey', { name1: 'piero' }];

    validateRemoteMethod([
      yup.string().required(),
      yup.object().shape({
        name: yup.string().required()
      })
    ])(args)
      .then(result => {})
      .catch(err => {
        console.log(err);
        err.inner[0].path.should.be.equal('name');
        err.inner[0].type.should.be.equal('required');
        done();
      });
  });
});
