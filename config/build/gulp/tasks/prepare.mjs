import { join } from 'path';

import chalk from 'chalk';
import gulp from 'gulp';

import { injectEnvFiles } from '../../utils/injectEnvFiles.mjs';
import { logger } from '../../utils/logger.mjs';

export function loadEnvVariables() {
	return gulp.task('prepare', async () => {
		try {
			if (!process.env.NODE_ENV && process.argv.includes('--dev')) {
				Object.assign(process.env, { NODE_ENV: 'development' });
			}

			injectEnvFiles({
				directory: join(process.cwd(), 'config/environments'),
				debug: true,
			});
		} catch (error) {
			logger.error(chalk.red.bold('✖ ') + chalk.red('Failed to load environment 🚫') + '\n' + chalk.red.dim(error));
			throw error;
		}
	});
}
