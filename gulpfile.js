var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var gulp = require('gulp');
var rimraf = require('rimraf');
var sass = require('gulp-ruby-sass');
var size = require('gulp-size');
var source = require('vinyl-source-stream');
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

gulp.task('copy:html', ['clean'], function() {
  return gulp.src('src/client/**/*.html')
    .pipe(gulp.dest('./dist/client'));
});

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src('src/client/assets/**/*.yaml')
    .pipe(gulp.dest('./dist/client/assets'));	
});

gulp.task('dist', ['browserify', 'build:scss', 'copy:html', 'copy:assets']);

gulp.task('serve', ['dist'], function() {
  return gulp.src(['dist/client', 'bower_components']).pipe(webserver());
});

