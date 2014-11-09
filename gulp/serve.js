'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('serve', ['dist'], function() {
  return gulp.src(['dist/client', 'bower_components']).pipe(webserver());
});
