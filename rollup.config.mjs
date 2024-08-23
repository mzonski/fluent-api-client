// @ts-check
import { defineConfig } from 'rollup';

import { createBaseOptions } from './config/build/rollup/options/base.mjs';
import { createDtsOptions } from './config/build/rollup/options/dts.mjs';
import { createOutputOptions } from './config/build/rollup/options/outputs.mjs';
import { getEnvironment } from './config/build/utils/environment.mjs';
import { injectEnvFiles } from './config/build/utils/injectEnvFiles.mjs';
import path from 'path';

const debug = Boolean(process.env.ROLLUP_DEBUG) ?? false;
const baseDir = process.cwd();

injectEnvFiles({
	directory: path.join(process.cwd(), 'config/environments'),
	debug,
});
const currentEnv = getEnvironment(baseDir, debug);
/**
 * @param {ReturnType<typeof getEnvironment>} env
 * @returns {import('rollup').RollupOptions[]}
 */
function createConfigs(env) {
	const baseConfig = createBaseOptions(env);
	const configs = createOutputOptions(baseConfig, env);

	configs.push(createDtsOptions(env));
	return configs;
}

export default defineConfig(createConfigs(currentEnv));
