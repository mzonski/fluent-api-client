// @ts-check
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';

/** @typedef {'cjs' | 'esm' | 'umd' | 'all'} BuildType */

function printEnvironmentVariables() {
	console.log(chalk.cyan.bold('🔧 ROLLUP Environment Variables:'));
	console.log(chalk.dim('━'.repeat(40)));

	Object.keys(process.env).forEach((key) => {
		if (key.startsWith('ROLLUP_')) {
			console.log(`${chalk.green(key)}: ${chalk.yellow(process.env[key])}`);
		}
	});

	console.log(chalk.dim('━'.repeat(40)));
	console.log(chalk.gray.italic('🏁 End of ROLLUP variables'));
}

/**
 * @param {string} baseDir
 * @param {boolean} debug
 * @returns {{
 *   includeDeps: boolean,
 *   buildType: BuildType,
 *   tsConfigPath: string,
 *   tsTypesTempDir: string,
 *   environment: string,
 *   outDir: string,
 *   outputFilename: string,
 *   isProduction: boolean,
 *   watch: boolean,
 *   debug: boolean,
 *   baseDir: string
 * }}
 */
export function getEnvironment(baseDir, debug = Boolean(process.env.ROLLUP_DEBUG) ?? false) {
	if (debug) {
		printEnvironmentVariables();
	}
	return {
		includeDeps: process.env.ROLLUP_INCLUDE_DEPS === 'true',
		buildType: /** @type {BuildType} */ (process.env.ROLLUP_OUTPUT_FORMAT ?? 'all'),
		tsConfigPath: process.env.ROLLUP_TS_CONFIG_PATH ?? './tsconfig.json',
		tsTypesTempDir: process.env.ROLLUP_TS_TEMP_DIR ?? 'temp-ts-types',
		environment: process.env.NODE_ENV ?? 'production',
		outDir: process.env.ROLLUP_OUTPUT_DIR ?? 'dist',
		outputFilename: process.env.ROLLUP_OUTPUT_FILENAME ?? 'fluent-api-client',
		isProduction: process.env.NODE_ENV === 'production',
		watch: process.env.ROLLUP_WATCH === 'true',
		baseDir: baseDir ?? process.cwd(),
		debug,
	};
}

export function getProjectRoot() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	return resolve(__dirname);
}
