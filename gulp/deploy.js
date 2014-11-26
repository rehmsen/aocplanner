/*jslint node: true */
'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var bump = require('gulp-bump');
var git = require('gulp-git');

gulp.task('bump:patch', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'))
  .pipe(git.commit('Bumping version.'));
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

// gulp.task('commit', ['bump:patch'], function(){
//   return gulp.src('./package.json')
//     .pipe(git.commit('initial commit'));
// });


gulp.task('deploy', ['dist'], shell.task([
  'goapp deploy dist'
]));
