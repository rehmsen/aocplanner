var gulp = require('gulp');
var rimraf = require('rimraf');
var ts = require('gulp-typescript');
var webserver = require('gulp-webserver');

gulp.task('clean', function(callback) {
  rimraf('./dist', callback);
});

gulp.task('build:ts', ['clean'], function() {
    var tsResult = gulp.src(['src/client/{app, components}/**/*.ts', 
    						 'typings/**/*.ts']).pipe(
    	ts({
    		noExternalResolve: true
    	}));
    return tsResult.js.pipe(gulp.dest('dist/client'));
});

gulp.task('copy:html', ['clean'], function() {
  return gulp.src('src/client/app/index.html')
    .pipe(gulp.dest('./dist/client'));
});

gulp.task('serve', ['build:ts', 'copy:html'], function() {
  return gulp.src(['dist/client', 'bower_components']).pipe(webserver());
});

