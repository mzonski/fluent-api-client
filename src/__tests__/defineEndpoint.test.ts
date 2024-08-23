import defineEndpoint from '../defineEndpoint';

describe('defineEndpoint', () => {
	it('should define an endpoint correctly', () => {
		const endpoint = defineEndpoint('getUsers', (config) =>
			config
				.setMethod('get')
				.setPath('/users/:userId/setting/:settingType')
				.setVersion('v1.0')
				.setRequiredHeaders('Authorization', 'X-API-Key'),
		);

		expect(endpoint).toEqual({
			method: 'get',
			path: '/users/:userId/setting/:settingType',
			version: 'v1.0',
			headers: ['Authorization', 'X-API-Key'],
		});
	});

	it('should throw an error for incomplete configuration', () => {
		expect(() => defineEndpoint('incomplete', (config) => config.setPath('/incomplete'))).toThrow(
			"Error configuring endpoint 'incomplete': Endpoint is not fully configured",
		);
	});

	it('should throw an error for invalid path', () => {
		expect(() =>
			defineEndpoint('invalidPath', (config) => config.setMethod('get').setPath('invalid').setVersion('v1.0')),
		).toThrow('Endpoint path must start with a forward slash (/)');
	});

	it('should throw an error for path ending with slash', () => {
		expect(() =>
			defineEndpoint('trailingSlash', (config) => config.setMethod('get').setPath('/users/').setVersion('v1.0')),
		).toThrow('Endpoint path must not end with a trailing slash');
	});
});
