import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';

import chalk from 'chalk';
import gulp from 'gulp';
import semver from 'semver';

import { logger } from '../../utils/logger.mjs';

const execPromise = util.promisify(exec);

async function readPackageJson(path) {
	const data = await fs.readFile(path, 'utf8');

	return JSON.parse(data);
}

async function writePackageJson(path, pkg) {
	await fs.writeFile(path, JSON.stringify(pkg, null, 2));
	await formatPackageJson(path);
}

async function formatPackageJson(path) {
	await execPromise(`prettier --write ${path}`);
}

export function bumpVersion() {
	return gulp.task('bump-version', async () => {
		try {
			const releasePackageJson = path.resolve(process.cwd(), 'config/package.release.json');

			const pkg = await readPackageJson(releasePackageJson);
			const newVersion = semver.inc(pkg.version, 'patch');

			if (!newVersion) {
				throw new Error('Invalid version or bump type');
			}

			pkg.version = newVersion;
			await writePackageJson(releasePackageJson, pkg);

			logger.success(chalk.green.bold('✔ ') + chalk.green(`Version bumped to ${chalk.cyan.bold(newVersion)} 🚀`));
			return newVersion;
		} catch (error) {
			logger.error(chalk.red.bold('✖ ') + chalk.red('Failed to bump version 📉') + '\n' + chalk.red.dim(error));
			throw error;
		}
	});
}

export function revertVersion(version) {
	return gulp.task('revert-version', async () => {
		try {
			const pkg = await readPackageJson();
			pkg.version = version;
			await writePackageJson(pkg);
			logger.info(chalk.blue.bold('ℹ ') + chalk.blue(`Version reverted to ${chalk.cyan.bold(version)} ⏪`));
		} catch (error) {
			logger.error(chalk.red.bold('✖ ') + chalk.red('Failed to revert version 🔄') + '\n' + chalk.red.dim(error));
			throw error;
		}
	});
}
