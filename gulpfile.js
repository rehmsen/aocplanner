var browserify = require('browserify');
var gulp = require('gulp');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var ts = require('gulp-typescript');
var webserver = require('gulp-webserver');

gulp.task('clean', function(callback) {
  rimraf('./dist', callback);
});

gulp.task('build:ts', ['clean'], function() {
    var tsResult = gulp.src(['src/client/{app, components}/**/*.ts', 
    						 'typings/**/*.ts']).pipe(
    	ts({
    		noExternalResolve: true,
    		module: 'commonjs'
    	}));
    return tsResult.js.pipe(gulp.dest('.tmp/client'));
});

gulp.task('browserify', ['build:ts'], function() {
  return browserify('./.tmp/client/app/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/client/'));
});



gulp.task('copy:html', ['clean'], function() {
  return gulp.src('src/client/**/*.html')
    .pipe(gulp.dest('./dist/client'));
});

gulp.task('serve', ['browserify', 'copy:html'], function() {
  return gulp.src(['dist/client', 'bower_components']).pipe(webserver());
});

