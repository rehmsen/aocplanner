/*jslint node: true */
'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var bump = require('gulp-bump');

gulp.task('bump:patch', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});


gulp.task('deploy', ['dist'], shell.task([
  'goapp deploy dist'
]));
