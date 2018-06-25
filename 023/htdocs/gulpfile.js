const gulp = require('gulp');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

//============================================================
// 　　JS
//============================================================

const jsDir = {
  'src':  './_src/_js/**/**.js',
  'dest': './_dest/js/'
}

const shaderDir = {
  'vert': './_src/_shader/**/**.vert',
  'frag': './_src/_shader/**/**.frag'
}

gulp.task('js', () => {

  const b = browserify({
    entries: ['./_src/_js/app.js'],
    transform: [
      ['babelify', {
        // presets: ['es2015', 'stage-3']
        presets: ['es2015']
      }],
      ['stringify', {
        appliesTo: {
          includeExtensions: ['.vert', '.frag']
        }
      }]
    ]
  });

  const bundle = () => {
    return b.bundle()
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest('./_dest/js/'))
      .pipe(reload({
        stream: true
      }))
      // .pipe(source('bundle.js'))
      // .pipe(buffer())
      // .pipe(uglify())
      // .pipe(gulp.dest('./_dest/js/'))
  };
  return bundle();
});

//============================================================
// 　　Browser Control
//============================================================

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './_dest/'
    }
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

//============================================================
// 　　Check
//============================================================

gulp.task('default', () => {
  gulp.watch('./_src/_js/**/**.js', {interval: 500}, ['js']);
  gulp.watch(shaderDir.vert, ['js']);
  gulp.watch(shaderDir.frag, ['js']);
});

gulp.task('default', ['browser-sync'], () => {
  gulp.watch('./_src/_js/**/**.js', {interval: 500}, ['js']);
  gulp.watch(shaderDir.vert, ['js']);
  gulp.watch(shaderDir.frag, ['js']);
});
