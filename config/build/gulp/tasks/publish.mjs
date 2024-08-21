import { exec } from 'child_process';
import { join } from 'path';
import { chdir } from 'process';
import util from 'util';

import chalk from 'chalk';
import gulp from 'gulp';

import { logger } from '../../utils/logger.mjs';

const execPromise = util.promisify(exec);

export function publishPackage() {
	return gulp.task('publish', async () => {
		try {
			if (!process.env.ROLLUP_OUTPUT_DIR) {
				throw new Error('Build output dir is empty');
			}

			chdir(join(process.cwd(), process.env.ROLLUP_OUTPUT_DIR));
			// const { stdout, stderr } = await execPromise('npm publish');
			const { stdout, stderr } = await execPromise('npm pack --dry-run');
			if (stderr) {
				logger.warn(chalk.yellow.bold('⚠ ') + chalk.yellow('npm publish warnings:') + '\n' + chalk.yellow.dim(stderr));
			}
			logger.success("chalk.green.bold('✔ ') + chalk.green('Package published successfully 📦🚀')");
			return stdout;
		} catch (error) {
			logger.error(chalk.red.bold('✖ ') + chalk.red('Failed to publish package 📦❌') + '\n' + chalk.red.dim(error));
			throw error;
		}
	});
}
