const yup = require('yup');

module.exports = yup.object().shape({
	title: yup.string().required(),
	type: yup.string(),
	pages: yup.array().of(
		yup.object().shape({
			number: yup.string().required()
		})
	),
	position: yup.object().shape({
		lat: yup.string().required(),
		long: yup.string().required(),
		nested: yup.array().min(1).of(
			yup.object().shape({
				mimmo: yup.number().required()
			})
		)
	})
})
