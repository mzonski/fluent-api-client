// @ts-check

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import dotenv from 'dotenv';

/**
 * @typedef {Object} InjectEnvOptions
 * @property {string} directory
 * @property {boolean} debug
 */

/**
 * @typedef {Record<string, string>} EnvObject
 */

/**
 * @param {InjectEnvOptions} options
 */
export function injectEnvFiles(options) {
	/** @type {InjectEnvOptions} */
	const { directory = process.cwd(), debug = false } = options;

	if (process.env.DOTENV_INJECTED) {
		debugLog('Environment variables already injected, skipping');
	}

	if (!['development', 'test', 'production'].includes(process.env.NODE_ENV || '')) {
		console.warn(
			chalk.yellow(
				`NODE_ENV "${chalk.bold(process.env.NODE_ENV)}" is not recognized. Defaulting to "${chalk.bold('production')}".`,
			),
		);
	}

	/** @type {boolean} */
	const isCI = process.env.CI === 'true' || process.env.CI === '1';

	/** @type {string} */
	const NODE_ENV = process.env.NODE_ENV || 'production';

	/** @type {string[]} */
	let envFiles = ['.env', '.env.local', `.env.${NODE_ENV}`, `.env.${NODE_ENV}.local`];

	if (isCI) {
		envFiles = envFiles.filter((file) => !file.endsWith('.local'));
	}

	/** @type {EnvObject} */
	const loadedEnv = {};

	/**
	 * @param {unknown} message
	 */
	function debugLog(message) {
		if (debug) {
			console.log(`[loadEnv] ${message}`);
		}
	}

	/**
	 * @param {string} filePath
	 * @returns {EnvObject}
	 */
	function parseEnvFile(filePath) {
		try {
			/** @type {EnvObject} */
			const envConfig = dotenv.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
			debugLog(chalk.green(`Loaded ${filePath}`));
			return envConfig;
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
				if (error.code !== 'ENOENT') {
					console.error(chalk.red(`Error reading ${filePath}:`), chalk.redBright(error.message));
				}
			} else {
				console.error(chalk.red(`An unexpected error occurred while reading ${filePath}`));
			}

			return {};
		}
	}

	/**
	 * @param {EnvObject} env
	 * @returns {EnvObject}
	 */
	function expandVariables(env) {
		/** @type {EnvObject} */
		const expanded = { ...env };
		Object.keys(env).forEach((key) => {
			expanded[key] = process.env[key] || expanded[key] || '';
		});

		return expanded;
	}

	envFiles.forEach((file) => {
		const filePath = path.resolve(directory, file);
		Object.assign(loadedEnv, parseEnvFile(filePath));
	});

	const expandedEnv = expandVariables(loadedEnv);

	Object.assign(expandedEnv, { DOTENV_INJECTED: true });
	Object.assign(process.env, expandedEnv);

	debugLog(
		chalk.green(`Environment variables loaded successfully`) +
			chalk.magenta(`(NODE_ENV: ${chalk.bold(NODE_ENV)}, CI: ${chalk.bold(String(isCI))})`),
	);
}
