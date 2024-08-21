// @ts-check
import { dts } from 'rollup-plugin-dts';

import { cleanupAfterBuild } from '../plugins/cleanup.mjs';
import { copyAssets } from '../plugins/copyAssets.mjs';

/**
 * @param {ReturnType<typeof import('../utils/environment.mjs').getEnvironment>} env
 * @returns {import('rollup').RollupOptions}
 */
export function createDtsOptions(env) {
	/** @type {boolean} */
	const buildAll = env.buildType === 'all';
	/** @type {'cjs' | 'esm' | 'umd'} */
	const format = buildAll ? 'esm' : env.buildType;

	return {
		input: `${env.baseDir}/${env.outDir}/${env.tsTypesTempDir}/index.d.ts`,
		output: {
			file: `${env.baseDir}/${env.outDir}/${env.outputFilename}.d.ts`,
			format: format === 'umd' || format === 'system' ? 'esm' : format,
		},
		plugins: [dts(), copyAssets(env), cleanupAfterBuild(env)],
	};
}
