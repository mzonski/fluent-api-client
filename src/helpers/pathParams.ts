import { Union } from './object';

type ParseParam<P extends string> = P extends `${infer Name}?` ? { [K in Name]?: string } : { [K in P]: string };

export type ParsePathParams<T extends string> =
	T extends `${string}:${infer Param}/${infer Rest}` ? Union<ParseParam<Param> & ParsePathParams<Rest>>
	: T extends `${string}:${infer Param}` ? ParseParam<Param>
	: T extends `${string}/${infer Rest}` ? ParsePathParams<Rest>
	: never;
