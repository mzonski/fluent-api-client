import { resolve } from 'path';

import chalk from 'chalk';
import gulp from 'gulp';
import { rollup } from 'rollup';
// eslint-disable-next-line import/no-unresolved
import { loadConfigFile } from 'rollup/loadConfigFile';

import { logger } from '../../utils/logger.mjs';

export function compile() {
	return gulp.task('compile', async () => {
		try {
			const configPath = resolve(process.cwd(), 'rollup.config.mjs');
			const { options, warnings } = await loadConfigFile(configPath, false);

			warnings.flush();

			for (const optionsObj of options) {
				const bundle = await rollup(optionsObj);
				await Promise.all(optionsObj.output.map(bundle.write));
			}

			logger.success(chalk.green.bold('✔ ') + chalk.green('Compilation completed successfully 🎉'));
		} catch (error) {
			logger.error(chalk.red.bold('✖ ') + chalk.red('Compilation failed 💥') + '\n' + chalk.red.dim(error));
			throw error;
		}
	});
}
