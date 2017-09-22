const should = require('should');
const app = require('loopback');
const yup = require('yup');
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
		const Book = dataSource.createModel('Book', {}, { mixins: { AdvancedValidation: {} } });
		Book.registerSchema(schema);
		Book.create(data)
			.then(book => {
				throw new Error('you shouldn\'t get here');
			})
			.catch(err => {
				err.should.not.be.Undefined();
				done();
			});
	});

	it('validation should succeed', done => {
		const Man = dataSource.createModel('Name', {
			name: String,
			favouriteNumber: Number
		}, { mixins: { AdvancedValidation: {} } });

		Man.registerSchema(
			yup.object().shape({
				name: yup.string(),
				favouriteNumber: yup.number().required(),
				type: yup.string()
			})
		);

		const manData = { name: 'Piero', favouriteNumber: '10' };
		Man.create(manData)
			.then(book => {
				const theBook = book.toObject();
				theBook.should.have.property('name').eql(manData.name);
				theBook.should.have.property('favouriteNumber').eql(10);
				done();
			});


	});
});
