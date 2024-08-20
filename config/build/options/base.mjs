import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import run from '@rollup/plugin-run';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { nodeExternals } from 'rollup-plugin-node-externals';
import typescriptEngine from 'typescript';

import { cleanupBeforeBuild } from '../plugins/cleanup.mjs';

/**
 * @param {ReturnType<typeof import('../utils/environment.mjs').getEnvironment>} env
 * @returns {import('rollup').RollupOptions}
 */
export function createBaseOptions(env) {
  const resolvePlugins = env.includeDeps
    ? [resolve({ preferBuiltins: true, browser: false, modulesOnly: true })]
    : [nodeExternals(), resolve({ preferBuiltins: false })];

  return {
    input: './src/index.ts',
    plugins: [
      cleanupBeforeBuild(env.outDir),
      ...resolvePlugins,
      commonjs(),
      typescript({
        tsconfig: env.tsConfigPath,
        typescript: typescriptEngine,
        sourceMap: !env.isProduction,
        outDir: `${env.outDir}/${env.tsTypesTempDir}`
      }),
      json(),
      env.isProduction ? terser() : undefined,
      env.watch
        ? run({
            execArgv: ['-r', 'source-map-support/register'],
          })
        : undefined,
    ],
    external: env.includeDeps ? [] : undefined,
  };
}
