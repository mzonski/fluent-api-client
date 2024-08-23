import { HttpMethod } from './helpers/httpMethod';
import { OverrideType } from './helpers/object';
import { ParsePathParams } from './helpers/pathParams';
import { SemVerFormat } from './helpers/semanticVersion';

type HeadersConfig<T extends string> = Record<T, string>;

interface EndpointData<TConfig extends InferredEndpointTypeInfo> {
	method: HttpMethod;
	path: string;
	headers?: string[];
	version: TConfig['__version'] extends undefined ? never : TConfig['__version'];
}

type EndpointMetadata<TRequest, TResponse, TQueryParams, TPathParams, TRequiredHeaders, TVersion> = {
	readonly __requestSchema: TRequest;
	readonly __responseSchema: TResponse;
	readonly __queryParams: TQueryParams;
	readonly __pathParams: TPathParams;
	readonly __requiredHeaders: TRequiredHeaders;
	readonly __version: TVersion;
};

export type Endpoint<TConfig extends InferredEndpointTypeInfo> = EndpointData<TConfig> &
	EndpointMetadata<
		TConfig['__requestSchema'],
		TConfig['__responseSchema'],
		TConfig['__queryParams'],
		TConfig['__pathParams'],
		TConfig['__requiredHeaders'],
		TConfig['__version']
	>;

type DefaultEndpointTypes = EndpointMetadata<unknown, unknown, unknown, unknown, unknown, unknown>;
type InferredEndpointTypeInfo<T = DefaultEndpointTypes> =
	T extends (
		EndpointMetadata<
			infer TRequest,
			infer TResponse,
			infer TQueryParams,
			infer TPathParams,
			infer TRequiredHeaders,
			infer TVersion
		>
	) ?
		EndpointMetadata<TRequest, TResponse, TQueryParams, TPathParams, TRequiredHeaders, TVersion>
	:	never;

type InferConfigurator<T> = T extends IEndpointConfigurator<infer TConfig> ? InferredEndpointTypeInfo<TConfig> : never;
type InferEndpoint<T> = T extends IEndpointConfigurator<infer TConfig> ? Endpoint<TConfig> : never;
type InferEndpointName<T extends string> = T extends infer TName ? { __endpointName: TName } : never;

type OverrideEndpointConfig<
	TConfig extends InferredEndpointTypeInfo,
	TKey extends keyof TConfig,
	TType,
> = IEndpointConfigurator<OverrideType<TConfig, TKey, TType>>;

interface IEndpointConfigurator<TConfig extends InferredEndpointTypeInfo> {
	setMethod<M extends HttpMethod>(method: M): this;

	setPath<TPath extends string>(path: TPath): OverrideEndpointConfig<TConfig, '__pathParams', ParsePathParams<TPath>>;

	setVersion<TVersion extends SemVerFormat>(version: TVersion): OverrideEndpointConfig<TConfig, '__version', TVersion>;

	defineRequestSchema<NewRequest>(): OverrideEndpointConfig<TConfig, '__requestSchema', NewRequest>;

	defineResponseSchema<NewResponse>(): OverrideEndpointConfig<TConfig, '__responseSchema', NewResponse>;

	defineQueryParamsSchema<NewQueryParams>(): OverrideEndpointConfig<TConfig, '__queryParams', NewQueryParams>;

	setRequiredHeaders<NewRequiredHeaders extends string[]>(
		...headers: NewRequiredHeaders
	): OverrideEndpointConfig<TConfig, '__requiredHeaders', HeadersConfig<NewRequiredHeaders[number]>>;

	finalize(): InferEndpoint<TConfig>;
}

class EndpointConfigurator<TConfig extends InferConfigurator<unknown>> implements IEndpointConfigurator<TConfig> {
	private metadata: Partial<EndpointData<TConfig>> = {};

	defineRequestSchema<NewRequest>() {
		return this as unknown as OverrideEndpointConfig<TConfig, '__requestSchema', NewRequest>;
	}

	defineResponseSchema<NewResponse>() {
		return this as unknown as OverrideEndpointConfig<TConfig, '__responseSchema', NewResponse>;
	}

	defineQueryParamsSchema<NewQueryParams>() {
		return this as unknown as OverrideEndpointConfig<TConfig, '__queryParams', NewQueryParams>;
	}

	setRequiredHeaders<NewRequiredHeaders extends string[]>(...headers: NewRequiredHeaders) {
		this.metadata.headers = headers;

		return this as unknown as OverrideEndpointConfig<
			TConfig,
			'__requiredHeaders',
			HeadersConfig<NewRequiredHeaders[number]>
		>;
	}

	setMethod(method: HttpMethod) {
		this.metadata.method = method;
		return this;
	}

	setPath<TPath extends string>(path: TPath) {
		EndpointConfigurator.validateEndpointPath(path);
		this.metadata.path = path;
		return this as unknown as OverrideEndpointConfig<TConfig, '__pathParams', ParsePathParams<TPath>>;
	}

	setVersion<TVersion extends SemVerFormat>(version: TVersion) {
		this.metadata.version = version as TConfig['__version'];
		return this as unknown as OverrideEndpointConfig<TConfig, '__version', TVersion>;
	}

	finalize() {
		if (!this.metadata.method || !this.metadata.path) {
			throw new Error('Endpoint is not fully configured. HTTP method and endpoint path must be set.');
		}
		return this.metadata as InferEndpoint<TConfig>;
	}

	static validateEndpointPath(path: string): void {
		if (!path.startsWith('/')) {
			throw new Error('Endpoint path must start with a forward slash (/)');
		}
		if (path.length > 1 && path.endsWith('/')) {
			throw new Error('Endpoint path must not end with a trailing slash');
		}
	}

	static create<TConfig extends InferConfigurator<unknown>>() {
		return new this<TConfig>();
	}
}

function defineEndpoint<TName extends string, TConfig extends IEndpointConfigurator<DefaultEndpointTypes>>(
	endpointName: TName,
	configurationFunction: (configurator: IEndpointConfigurator<DefaultEndpointTypes>) => TConfig,
): InferEndpoint<TConfig> & InferEndpointName<TName> {
	const configurator = EndpointConfigurator.create();
	const configuredEndpoint = configurationFunction(configurator);

	try {
		return configuredEndpoint.finalize() as InferEndpoint<TConfig> & InferEndpointName<TName>;
	} catch (error) {
		throw new Error(
			`Error configuring endpoint '${endpointName}': ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

export default defineEndpoint;
