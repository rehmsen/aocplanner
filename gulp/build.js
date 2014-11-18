/*jslint node: true */
'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var gulp = require('gulp');
var rimraf = require('rimraf');
var sass = require('gulp-ruby-sass');
var size = require('gulp-size');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var ts = require('gulp-typescript');
var useref = require('gulp-useref');
var wiredep = require('wiredep').stream;


function handleError(err) {
  console.error(err.toString());
  
}

gulp.task('clean:dist', function(callback) {
  rimraf('./dist', callback);
});

gulp.task('clean:tmp', function(callback) {
  rimraf('./.tmp', callback);
});

gulp.task('clean', ['clean:dist', 'clean:tmp']);

gulp.task('build:ts', function() {
    var tsResult = gulp.src([
        'src/client/{app,components}/**/*.ts', 'typings/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
          noExternalResolve: true, 
          module: 'commonjs',
          noImplicitAny: true
        }));
    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.tmp/client'));
});

gulp.task('browserify', ['build:ts'], function() {
  return browserify('./.tmp/client/app/app.js', {debug: true, standalone: 'noscope'})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist/client/'));
});

gulp.task('build:scss', function () {
  return gulp.src('src/client/{app,components}/**/*.scss')
    .pipe(sass({
      style: 'expanded',
      loadPath: 'src/client/'
    }))
    .on('error', handleError)
    .pipe(autoprefixer('last 1 version'))
    .pipe(gulp.dest('dist/client'))
    .pipe(size());
});

gulp.task('build:sprite', function () {
  return gulp.src('src/client/assets/images/icons/**/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      algorithm: 'binary-tree'
    }))
    .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:assets', function() {
  return gulp.src('src/client/assets/**/*.yaml')
    .pipe(gulp.dest('./dist/client/assets')); 
});

gulp.task('copy:favicon', function() {
  return gulp.src('src/client/favicon.ico')
    .pipe(gulp.dest('./dist/client/')); 
});

gulp.task('copy:images', function() {
  return gulp.src('src/client/assets/images/!(icons)/**/*.{gif,jpg,png}')
    .pipe(gulp.dest('./dist/client/assets/images/')); 
});

gulp.task('build:dependencies', function () {
  var assets = useref.assets();
  return gulp.src('./src/client/**/*.html')
      .pipe(wiredep({}))
      .pipe(assets)
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:go', function() {
  return gulp.src('src/**/*.go')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy:appyaml', function() {
  return gulp.src('src/app.yaml')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist', [
  'browserify', 
  'build:scss', 
  'build:sprite',
  'copy:assets',
  'copy:images',
  'build:dependencies',
  'copy:go',
  'copy:appyaml',
  'copy:favicon']);
