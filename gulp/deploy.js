/*jslint node: true */
'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var bump = require('gulp-bump');
var git = require('gulp-git');

['patch', 'minor', 'major'].forEach(function(type) {
  gulp.task('bump:' + type, function() {
    gulp.src('./package.json')
      .pipe(bump({type: type}))
      .pipe(gulp.dest('./'))
      .pipe(git.commit('Bumping version.'));
  });
}); 

gulp.task('deploy', ['dist'], shell.task([
  'goapp deploy dist'
]));
