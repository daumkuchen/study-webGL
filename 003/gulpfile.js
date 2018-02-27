'use strict';

// node.jsのCoreモジュール
const path = require('path');
// gulp様
const gulp = require('gulp');
// gulpのUtility（便利ツール的なやつです）
const gutil = require('gulp-util');
// 本日の主役のbrowserify様
const browserify = require('browserify');
// ~ify四天王の一人。変更を監視して、差分を管理してbrowserifyを実行してくれる
const watchify = require('watchify');
// gulp-browserifyを使わない時には必須。
const source = require('vinyl-source-stream');

// ログ出力用の関数用オブジェクト
let bundleLogger = {
  // 構築中ログ
  start: filepath => {
    gutil.log('Bundling', gutil.colors.green(filepath) + '...');
  },
  // 何をwatchしているかを表示
  watch: bundleName => {
    gutil.log('Watching files required by', gutil.colors.yellow(bundleName));
  }
};

// 変更したファイルを出力する関数
let changeFileLog = (filePath, msg) => {
  gutil.log(
    gutil.colors.green(path.relative(process.cwd(), filePath)) + ' ' + gutil.colors.blue(msg)
  );
};

// defaultタスク --- 'gulp'と打つと実行されます
gulp.task('default', ()=>{
  // browserifyの設定
  let b = browserify({
    // 対象ファイル
    entries: ['js/main.js'],
    // 使用する~ifyを指定
    transform: [
      // babelifyを使用してコンパイル元でECMAScriptが使えるように設定
      ['babelify', {presets: ['es2015']}],
      // 大本命のstringify様。あらゆるファイルをテキストとしてexportしてくれる
      ['stringify', {appliesTo: {includeExtensions: ['.vert', '.frag']}}]
    ]
  });

  // browserifyの動作設定
  let bundle = () => {
    // スタート時にログ出力用の関数用オブジェクトのstartを発火
    bundleLogger.start('dist.js');
    return b.bundle()
      //出力するjsのファイル名
      .pipe(source('dist.js'))
      //jsの出力先
      .pipe(gulp.dest('dist'));
  };

  // 先ほど宣言したbrowserifyを使いまわしてwatchifyを設定
  b = watchify(b);
  // 変更を察知した時の処理
  b.on('update', (evt) => {
    evt.forEach((val) => {
      // 変更したファイルを出力
      changeFileLog(val, 'changed');
    });
    // browserifyを実行
    return bundle();
  });

  // log出力時に表示させる
  b.on('log', gutil.log);

  // ログ出力用の関数用オブジェクトのwatchを発火
  bundleLogger.watch('dist.js');

  return bundle();
});
