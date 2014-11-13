/*jslint node: true */
'use strict';

var gulp = require('gulp');

gulp.task('watch', ['dist'] ,function () {
  gulp.watch('src/client/{app,components}/**/*.scss', ['build:scss']);
  gulp.watch('src/client/{app,components}/**/*.ts', ['browserify']);
  gulp.watch([
      'src/client/{app,components}/**/*.html',
      'bower_components/**/*'], ['build:dependencies']);
  gulp.watch('src/client/assets/images/!(icons)/**/*', ['copy:images']);
  gulp.watch('src/client/assets/images/icons/**/*', ['build:sprite']);
  gulp.watch('src/client/assets/**/*.yaml', ['copy:assets']);
});
