import { resolve } from 'path';
import { chdir } from 'process';

export function normalizeTaskBuildRoot() {
	const projectRoot = resolve(process.cwd(), '../../..');
	chdir(projectRoot);
	return projectRoot;
}
