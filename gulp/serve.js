/*jslint node: true */
'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('serve', ['watch'], shell.task([
  'goapp serve dist'
]));

gulp.task('deploy', ['watch'], shell.task([
  'goapp deploy dist'
]));
