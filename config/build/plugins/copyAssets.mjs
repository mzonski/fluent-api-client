// @ts-check
import copy from 'rollup-plugin-copy';

/**
 * @param {ReturnType<typeof import('../utils/environment.mjs').getEnvironment>} env
 * @returns {import('rollup').Plugin}
 */
export function copyAssets(env) {
	return copy({
		targets: [
			{ src: 'config/package.release.json', dest: env.outDir, rename: 'package.json' },
			{ src: 'LICENSE.md', dest: env.outDir },
			{ src: 'README.md', dest: env.outDir },
		],
	});
}
