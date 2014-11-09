'use strict';

var gulp = require('gulp');

gulp.task('watch', ['dist'] ,function () {
  gulp.watch('src/client/{app,components}/**/*.scss', ['build:scss']);
  gulp.watch('src/client/{app,components}/**/*.ts', ['browserify']);
  gulp.watch('src/client/{app,components}/**/*.html', ['copy:html']);
  gulp.watch('src/client/assets/images/!(icons)/**/*', ['copy:images']);
  gulp.watch('src/client/assets/images/icons/**/*', ['build:sprites']);
  gulp.watch('src/client/assets/**/*.yaml', ['copy:assets']);
});
