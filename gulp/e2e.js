var gulp = require('gulp');
var protractor = require('gulp-protractor').protractor;
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');


gulp.task('build:ts:e2e', function() {
    var tsResult = gulp.src([
        'src/e2e-tests/**/*.ts', 
        'typings/**/*.ts', 
        '!typings/angularjs/*.d.ts',
        '!typings/jquery/jquery.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
          noExternalResolve: true, 
          module: 'commonjs',
          noImplicitAny: true
        }));
    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.tmp/client/tests/e2e/'));
});

gulp.task('test:e2e', ['build:ts:e2e'], function() {
  gulp.src(['./.tmp/e2e-tests/*.js'])
      .pipe(protractor({
          configFile: './protractor.config.js',
          args: ['--baseUrl', 'http://127.0.0.1:8000']
      })) 
      .on('error', function(e) { throw e; });
});
