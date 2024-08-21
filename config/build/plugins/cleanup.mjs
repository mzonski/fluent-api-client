// @ts-check
// eslint-disable-next-line import/no-unresolved
import { del } from '@kineticcafe/rollup-plugin-delete';

/**
 * @param {string} outDir
 * @returns {import('rollup').Plugin}
 */
export function cleanupBeforeBuild(outDir) {
	return del({
		targets: outDir,
		runOnce: true,
		hook: 'buildStart',
	});
}

/**
 * @param {ReturnType<typeof import('../utils/environment.mjs').getEnvironment>} env
 * @returns {import('rollup').Plugin}
 */
export function cleanupAfterBuild(env) {
	return del({
		targets: `${env.outDir}/${env.tsTypesTempDir}`,
		hook: 'writeBundle',
	});
}
