import { ParsePathParams } from '../../helpers/pathParams';

describe('Path params tests', () => {
	it('should correctly extract path parameters', () => {
		type Params1 = ParsePathParams<'/users/:userId/posts/:postId'>;
		type ExpectedParams1 = { userId: string; postId: string };
		expectTypeOf<Params1>().toEqualTypeOf<ExpectedParams1>();

		type Params2 = ParsePathParams<'/users/:userId?/posts/:postId?'>;
		type ExpectedParams2 = { userId?: string; postId?: string };
		expectTypeOf<Params2>().toEqualTypeOf<ExpectedParams2>();

		type Params3 = ParsePathParams<'/users'>;
		type ExpectedParams3 = never;
		expectTypeOf<Params3>().toEqualTypeOf<ExpectedParams3>();

		type Params4 = ParsePathParams<'/users/:userId'>;
		type ExpectedParams4 = { userId: string };
		expectTypeOf<Params4>().toEqualTypeOf<ExpectedParams4>();
	});
});
