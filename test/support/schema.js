module.exports = {
	properties: {
		title: {
			type: 'string'
		},
		pages: {
			type: 'array',
			items: {
				type: 'object',
				number: {
					type: 'string'
				},
				required: ['number']
			}
		},
		position: {
			type: 'object',
			properties: {
				lat: {
					type: 'string'
				},
				long: {
					type: 'string',
					asyncValidation: {}
				},
				nested: {
					type: 'array',
					minItems: 1,
					contains: {
						type: 'object',
						properties: {
							mimmo: {
								type: 'number'
							}
						},
						required: ['mimmo']
					}
				}
			},
			required: ['lat', 'long']
		}
	},
	required: ['name', 'position']
};
