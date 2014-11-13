'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');

gulp.task('serve', ['watch'], function() {
  return gulp.src(['dist/client', 'bower_components']).pipe(webserver());
});
