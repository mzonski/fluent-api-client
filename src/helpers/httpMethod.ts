export const HTTP_METHODS = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	PATCH: 'patch',
	DELETE: 'delete',
	HEAD: 'head',
	OPTIONS: 'options',
} as const;

export const HTTP_METHOD_LIST = Object.values(HTTP_METHODS);

export type HttpMethod = (typeof HTTP_METHOD_LIST)[number];
