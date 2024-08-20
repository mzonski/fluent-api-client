// @ts-check

import fs from 'fs';
import path from 'path';

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
 * @returns {EnvObject}
 */
export function injectEnvFiles(options) {
  /** @type {InjectEnvOptions} */
  const { directory = process.cwd(), debug = false } = options;

  if (!['development', 'test', 'production'].includes(process.env.NODE_ENV || '')) {
    console.warn(`NODE_ENV "${process.env.NODE_ENV}" is not recognized. Defaulting to "production".`);
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
   * @param {string} filePath - The path to the env file
   * @returns {EnvObject} The parsed env file contents
   */
  function parseEnvFile(filePath) {
    try {
      /** @type {EnvObject} */
      const envConfig = dotenv.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
      debugLog(`Loaded ${filePath}`);
      return envConfig;
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        if (error.code !== 'ENOENT') {
          console.error(`Error reading ${filePath}:`, error.message);
        }
      } else {
        console.error(`An unexpected error occurred while reading ${filePath}`);
      }

      return {};
    }
  }

  /**
   * @param {EnvObject} env - The env object to expand
   * @returns {EnvObject} The expanded env object
   */
  function expandVariables(env) {
    /** @type {EnvObject} */
    const expanded = { ...env };
    Object.keys(env).forEach((key) => {
      expanded[key] = process.env[key] || expanded[key] || '';
    });

    return expanded;
  }

  for (const file of envFiles) {
    const filePath = path.resolve(directory, file);
    Object.assign(loadedEnv, parseEnvFile(filePath));
  }

  const expandedEnv = expandVariables(loadedEnv);

  Object.assign(process.env, expandedEnv);

  debugLog(`Environment variables loaded successfully (NODE_ENV: ${NODE_ENV}, CI: ${isCI})`);
  return expandedEnv;
}
