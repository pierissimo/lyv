const should = require('should');
const app = require('loopback');
const schema = require('../support/schema');
const data = require('../support/data');

// https://github.com/strongloop/loopback-boot/blob/master/lib/executor.js#L57-L71
// the loopback-boot module patches in the loopback attribute so we can assume the same
app.loopback = require('loopback');

const dataSource = app.createDataSource({
	connector: app.Memory
});

require('../../index')(app);

describe('loopback datasource validation', () => {
	it('validation should fail', done => {
		const Book = dataSource.createModel('Book',
			{ name: String, type: String },
			{
				validationSchema: schema,
				mixins: { AdvancedValidation: {} }
			}
		);

		Book.create(data)
			.then(book => {})
			.catch(err => {
				err.should.not.be.Undefined();
				done();
			});
	});

	it('validation should succeed', done => {
		const Man = dataSource.createModel('Name',
			{ name: String },
			{
				validationSchema: {
					properties: {
						name: {
							type: 'string'
						}
					},
					required: ['name']
				},
				mixins: { AdvancedValidation: {} }
			}
		);

		const manData = { name: 'Piero' };
		Man.create(manData)
			.then(book => {
				book.toObject().should.have.property('name').eql(manData.name);
				done();
			})
	});
});
