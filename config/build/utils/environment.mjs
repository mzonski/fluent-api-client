// @ts-check
/** @typedef {'cjs' | 'esm' | 'umd' | 'all'} BuildType */

function printEnvironmentVariables() {
  console.log('[process.env] ROLLUP_INCLUDE_DEPS = ', process.env.ROLLUP_INCLUDE_DEPS);
  console.log('[process.env] ROLLUP_OUTPUT_FORMAT = ', process.env.ROLLUP_OUTPUT_FORMAT);
  console.log('[process.env] ROLLUP_TS_CONFIG_PATH = ', process.env.ROLLUP_TS_CONFIG_PATH);
  console.log('[process.env] ROLLUP_TS_TEMP_DIR = ', process.env.ROLLUP_TS_TEMP_DIR);
  console.log('[process.env] ROLLUP_OUTPUT_DIR = ', process.env.ROLLUP_OUTPUT_DIR);
  console.log('[process.env] ROLLUP_OUTPUT_FILENAME = ', process.env.ROLLUP_OUTPUT_FILENAME);
  console.log('[process.env] NODE_ENV = ', process.env.NODE_ENV);
  console.log('[process.env] ROLLUP_WATCH = ', process.env.ROLLUP_WATCH);
  console.log('[process.env] ROLLUP_WATCH = ', process.env.ROLLUP_DEBUG);
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
