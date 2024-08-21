import { compile } from "./tasks/compile.mjs";
import { bumpVersion, revertVersion } from "./tasks/version.mjs";
import { publishPackage } from "./tasks/publish.mjs";
import gulp from "gulp";
import { logger } from "../utils/logger.mjs";
import { loadEnvVariables } from "./tasks/prepare.mjs";
import { normalizeTaskBuildRoot } from "./tasks/utils.mjs";
import chalk from "chalk";

normalizeTaskBuildRoot();

loadEnvVariables();
compile();
bumpVersion();
revertVersion();
publishPackage();

gulp.task('build', gulp.series('prepare', 'compile'));

gulp.task(
  'build-and-publish',
  gulp.series('build', 'bump-version', 'publish', (done) => {
    logger.success('Build and publish completed successfully');
    done();
  }),
);

function onError(err) {
  console.log(chalk.red.bold('✖ ') + chalk.red('An error occurred:') + '\n' + chalk.yellow(err));

  process.exit(1);
}

gulp.task('default', gulp.task('build'));
