// @ts-check
import { dts } from 'rollup-plugin-dts';

import { cleanupAfterBuild } from '../plugins/cleanup.mjs';
import { copyAssets } from '../plugins/copyAssets.mjs';

/**
 * @param {ReturnType<typeof import('../../utils/environment.mjs').getEnvironment>} env
 * @returns {import('rollup').RollupOptions}
 */
export function createDtsOptions(env) {
	/** @type {'cjs' | 'esm' | 'umd' | 'system'} */
	const format = env.buildType === 'all' ? 'esm' : env.buildType;

	return {
		input: `${env.baseDir}/${env.outDir}/${env.tsTypesTempDir}/index.d.ts`,
		output: {
			file: `${env.baseDir}/${env.outDir}/${env.outputFilename}.d.ts`,
			format,
		},
		plugins: [dts(), copyAssets(env), cleanupAfterBuild(env)],
	};
}
