const gulp = require('gulp');
const gutil = require('gulp-util');
const buffer = require('vinyl-buffer')

// html
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const minifyejs = require('gulp-minify-ejs')

// css
const sass = require('gulp-sass');
const cssnext = require('gulp-cssnext');
const csscomb = require('gulp-csscomb');
const cmq = require('gulp-combine-media-queries');
const gcmq = require('gulp-group-css-media-queries');
const minifycss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');

// js
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// browser
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

// util
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');

// img
const imagemin = require("gulp-imagemin");
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
// const svgo = require('imagemin-svgo');
// const optipng = require('imagemin-optipng');
// const gifsicle = require('imagemin-gifsicle');

//============================================================
// 　　EJS
//============================================================

const ejsDir = {
  'src': ['./_src/_ejs/**/*.ejs', '!' + './_src/_ejs/**/_*.ejs'],
  'dest': './_dest/'
};

gulp.task('ejs', () => {
  gulp.src(ejsDir.src)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(ejs())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(minifyejs())
    // .pipe(notify('[EJS] Compliled:)'))
    .pipe(gulp.dest(ejsDir.dest))
    .pipe(reload({
      stream: true
    }))
});

//============================================================
// 　　SCSS
//============================================================

const cssDir = {
  'src':  './_src/_scss/**/*.scss',
  'dest': './_dest/css/'
}

gulp.task('scss', () => {
  return gulp.src(cssDir.src)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass())
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(cssnext({
      browsers: 'last 2 versions',
    }))
    // pipe(autoprefixer({
    //   browsers: 'last 2 versions',
    //   cascade: false
    // }))
    .pipe(gcmq())
    // .pipe(cmq({
    //   log: true
    // }))
    .pipe(csscomb())
    .pipe(minifycss())
    // .pipe(notify('[CSS] Compliled:)'))
    .pipe(gulp.dest(cssDir.dest))
    .pipe(reload({
      stream: true
    }))
});

//============================================================
// 　　IMAGE MIN
//============================================================

const imgDir = {
  'src':  './_src/_img/**/*',
  'dest': './_dest/img/'
}

gulp.task('imagemin', () => {
  return gulp.src(imgDir.src)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(imagemin([
      pngquant({
        quality: '65-80',
        speed: 1,
        floyd: 0
      }),
      mozjpeg({
        quality: 85,
        progressive: true
      })
      // imagemin.svgo(),
      // optipng(),
      // gifsicle()
    ]))
    .pipe(notify('[img] Optimized:)'))
    .pipe(gulp.dest(imgDir.dest))
    .pipe(reload({
      stream: true
    }))
});

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

  let b = browserify({
    entries: ['./_src/_js/app.js'],
    transform: [
      ['babelify', {
        presets: ['es2015']
      }],
      ['stringify', {
        appliesTo: {
          includeExtensions: ['.vert', '.frag']
        }
      }]
    ]
  });

  let bundle = () => {
    return b.bundle()
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./_dest/js/'))
      .pipe(reload({
        stream: true
      }))
  };

  // b = watchify(b);
  //
  // b.on('update', () => {
  //   return bundle();
  // });

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
  gulp.watch(ejsDir.src, {interval: 500}, ['ejs']);
  gulp.watch('./_src/_ejs/**/_*.ejs', {interval: 500}, ['ejs']);
  gulp.watch(cssDir.src, {interval: 500}, ['scss']);
  gulp.watch('./_src/_js/**/**.js', {interval: 500}, ['js']);
  gulp.watch(shaderDir.vert, ['shader']);
  // gulp.watch(shaderDir.frag, ['shader']);
});

gulp.task('default', ['browser-sync'], () => {
  gulp.watch(ejsDir.src, {interval: 500}, ['ejs']);
  gulp.watch('./_src/_ejs/**/_*.ejs', {interval: 500}, ['ejs']);
  gulp.watch(cssDir.src, {interval: 500}, ['scss']);
  gulp.watch('./_src/_js/**/**.js', {interval: 500}, ['js']);
  // gulp.watch(shaderDir.vert, ['shader']);
  // gulp.watch(shaderDir.frag, ['shader']);
});
