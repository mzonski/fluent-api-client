// @ts-check
import { defineConfig } from 'rollup';

import { createBaseOptions } from './config/build/options/base.mjs';
import { createDtsOptions } from './config/build/options/dts.mjs';
import { createOutputOptions } from './config/build/options/outputs.mjs';
import { getEnvironment } from './config/build/utils/environment.mjs';
import { injectEnvFiles } from './config/build/utils/injectEnvFiles.mjs';
import path from "path";

const baseDir = process.cwd();

const debug = process.env.ROLLUP_DEBUG ?? false;

injectEnvFiles({
  directory: path.join(baseDir, "config/environments"),
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
