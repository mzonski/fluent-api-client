import { expectTypeOf } from 'vitest';

import defineEndpoint from '../defineEndpoint';
import { HttpMethod } from '../helpers/httpMethod';

describe('defineEndpoint type tests', () => {
	it('should infer correct types for a basic endpoint', () => {
		const endpoint = defineEndpoint('basicEndpoint', (config) => config.setMethod('get').setPath('/users'));

		expectTypeOf(endpoint.method).toEqualTypeOf<HttpMethod>();
		expectTypeOf(endpoint.path).toEqualTypeOf<string>();
		expectTypeOf(endpoint.headers).toEqualTypeOf<string[] | undefined>();
		expectTypeOf(endpoint.version).toEqualTypeOf<unknown>();

		expectTypeOf(endpoint.__requestSchema).toEqualTypeOf<unknown>();
		expectTypeOf(endpoint.__responseSchema).toEqualTypeOf<unknown>();
		expectTypeOf(endpoint.__queryParams).toEqualTypeOf<unknown>();
		expectTypeOf(endpoint.__pathParams).toEqualTypeOf<never>();
		expectTypeOf(endpoint.__requiredHeaders).toEqualTypeOf<unknown>();
		expectTypeOf(endpoint.__version).toEqualTypeOf<unknown>();
		expectTypeOf(endpoint.__endpointName).toEqualTypeOf<'basicEndpoint'>();
	});

	it('should infer correct types for an endpoint with defined schemas', () => {
		const endpoint = defineEndpoint('complexEndpoint', (config) =>
			config
				.setMethod('post')
				.setPath('/users/:userId/posts/:postId/:actionType/:variant?')
				.setVersion('v2.1')
				.setRequiredHeaders('Authorization', 'Content-Type')
				.defineRequestSchema<{ title: string; content: string }>()
				.defineResponseSchema<{ id: number; created: string }>()
				.defineQueryParamsSchema<{ draft: boolean }>(),
		);

		expectTypeOf(endpoint.__requestSchema).toEqualTypeOf<{ title: string; content: string }>();
		expectTypeOf(endpoint.__responseSchema).toEqualTypeOf<{ id: number; created: string }>();
		expectTypeOf(endpoint.__queryParams).toEqualTypeOf<{ draft: boolean }>();
		expectTypeOf(endpoint.__pathParams).toEqualTypeOf<{
			userId: string;
			postId: string;
			actionType: string;
			variant?: string | undefined;
		}>();
		expectTypeOf(endpoint.__requiredHeaders).toEqualTypeOf<{ 'Authorization': string; 'Content-Type': string }>();
		expectTypeOf(endpoint.__version).toEqualTypeOf<'v2.1'>();
		expectTypeOf(endpoint.version).toEqualTypeOf<'v2.1'>();
		expectTypeOf(endpoint.__endpointName).toEqualTypeOf<'complexEndpoint'>();
	});
});
