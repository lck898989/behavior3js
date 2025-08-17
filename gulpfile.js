import gulp from 'gulp';
import jshint from 'gulp-jshint';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import yuidoc from 'gulp-yuidoc';
import zip from 'gulp-zip';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import info from './package.json' assert { type: 'json' };

const NAME = 'behavior3-' + info.version;

function jshintTask() {
  return gulp.src(['src/b3.js', 'src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}

function buildTask() {
  return browserify('./src/index.js', { standalone: 'b3' })
    .transform(babelify, {
      presets: ['@babel/preset-env']
    })
    .transform('uglifyify', { global: true })
    .bundle()
    .pipe(source('bundled-app.js'))
    .pipe(buffer())
    .pipe(rename(NAME + '.js'))
    .pipe(gulp.dest('./libs'));
}

function docsTask() {
  const OPTS = {
    themedir: 'docs/theme',
    helpers: ['docs/theme/helpers.js'],
  };
  return gulp.src(['src/b3.js', 'src/**/*.js'])
    .pipe(yuidoc(OPTS, OPTS))
    .pipe(gulp.dest('./docs/' + NAME))
    .pipe(zip(NAME + '.docs.zip'))
    .pipe(gulp.dest('./docs/'));
}

function devTask() {
  gulp.watch('src/**/*.js', jshintTask);
}

export { jshintTask as _jshint, buildTask as _build, docsTask as _docs, devTask as dev };
export const build = gulp.parallel(buildTask, docsTask);
