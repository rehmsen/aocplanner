var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var gulp = require('gulp');
var rimraf = require('rimraf');
var sass = require('gulp-ruby-sass');
var size = require('gulp-size');
var source = require('vinyl-source-stream');
var spritesmith = require('gulp.spritesmith');
var ts = require('gulp-typescript');
var webserver = require('gulp-webserver');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('clean:dist', function(callback) {
  rimraf('./dist', callback);
});

gulp.task('clean:tmp', function(callback) {
  rimraf('./.tmp', callback);
});

gulp.task('clean', ['clean:dist', 'clean:tmp']);

gulp.task('build:ts', ['clean'], function() {
    var tsResult = gulp.src(['src/client/{app,components}/**/*.ts', 
                 'typings/**/*.ts']).pipe(
      ts({
        noExternalResolve: true,
        module: 'commonjs'
      })).on('error', handleError);
    return tsResult.js.pipe(gulp.dest('.tmp/client'));
});

gulp.task('browserify', ['build:ts'], function() {
  return browserify('./.tmp/client/app/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/client/'));
});

gulp.task('build:scss', ['clean'],  function () {
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


gulp.task('copy:html', ['clean'], function() {
  return gulp.src('src/client/**/*.html')
    .pipe(gulp.dest('./dist/client'));
});

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src('src/client/assets/**/*.yaml')
    .pipe(gulp.dest('./dist/client/assets')); 
});

gulp.task('copy:images', ['clean'], function() {
  return gulp.src('src/client/assets/images/!(icons)/**/*.{gif,jpg,png}')
    .pipe(gulp.dest('./dist/client/assets/images/')); 
});

gulp.task('dist', [
  'browserify', 
  'build:scss', 
  'build:sprite',
  'copy:html', 
  'copy:assets',
  'copy:images']);

gulp.task('serve', ['dist'], function() {
  return gulp.src(['dist/client', 'bower_components']).pipe(webserver());
});

