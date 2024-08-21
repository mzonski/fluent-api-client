import chalk from 'chalk';
import gulp from 'gulp';

import { logger } from '../utils/logger.mjs';

export function runTask(taskName) {
	import('./.gulpfile.mjs');

	return new Promise((resolve, reject) => {
		gulp.task(taskName)((err) => {
			if (err) {
				logger.error(
					chalk.red.bold('✖ ') + chalk.red(`Task ${chalk.cyan.bold(taskName)} failed 🛑`) + '\n' + chalk.red.dim(err),
				);
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
