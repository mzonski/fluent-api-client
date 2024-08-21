// @ts-check
/**
 * @param {'cjs' | 'esm' | 'umd'} format
 * @returns {'.cjs' | '.mjs' | '.js'}
 */
const getExtension = (format) => {
	switch (format) {
		case 'cjs':
			return '.cjs';
		case 'esm':
			return '.mjs';
		case 'umd':
		case 'system':
		default:
			return '.js';
	}
};

/**
 * @param {'cjs' | 'esm' | 'umd'} format
 * @param {ReturnType<typeof import('../utils/environment.mjs').getEnvironment>} env
 * @param {boolean} buildAll
 * @returns {import('rollup').OutputOptions}
 */
export function generateOutputOptions(format, env, buildAll) {
	/**
	 * @type {import('rollup').OutputOptions | import('rollup').OutputOptions[]}
	 */
	const config = {
		dir: env.outDir,
		entryFileNames: `${buildAll ? `${format}/` : ''}${env.outputFilename}${env.isProduction ? '.min' : ''}${getExtension(format)}`,
		format,
		sourcemap: !env.isProduction,
		exports: 'named',
	};

	if (format === 'umd' || format === 'system') {
		config.name = env.outputFilename;
	}

	return config;
}

/**
 * @param {import('rollup').RollupOptions} baseConfig
 * @param {ReturnType<typeof import('../utils/environment.mjs').getEnvironment>} env
 * @returns {import('rollup').RollupOptions[]}
 */
export function createOutputOptions(baseConfig, env) {
	/** @type {('cjs' | 'esm' | 'umd')[]} */
	const formats = ['cjs', 'esm', 'umd'];

	if (env.buildType !== 'all') {
		return [
			{
				...baseConfig,
				output: generateOutputOptions(env.buildType, env, false),
			},
		];
	}

	return formats.map((format) => ({
		...baseConfig,
		output: generateOutputOptions(format, env, true),
	}));
}
