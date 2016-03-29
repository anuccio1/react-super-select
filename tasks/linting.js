var eslint = require('gulp-eslint'),
    exec = require('child_process').exec,
    recess = require('gulp-recess'),
    runSequence = require('run-sequence');

module.exports = function(gulp, config) {

  gulp.task('watch', [
    'docs_watch',
    'watch:examples-lint'
  ]);

  gulp.task('lint:tasks', function() {
    return gulp.src(config.tasks.lint.js)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  });

  gulp.task('watch:tasks', [
    'lint:tasks',
  ], function() {
    gulp.watch([config.tasks.lint.js], ['lint:tasks']);
  });

  gulp.task('lint-js', function() {
    return gulp.src(config.component.lint.js)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  });

  gulp.task('lint-less', function () {
      return gulp.src(config.component.lint.less)
          .pipe(recess({
            strictPropertyOrder: false,
            noIDs: true,
            noJSPrefix: true,
            noOverqualifying: false,
            noUnderscores: true,
            noUniversalSelectors: false
          }))
          .pipe(recess.reporter({
            fail: false
          }));
  });

  gulp.task('less-compile', function(cb) {
    exec('npm run npm:build:css', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });

  gulp.task('watch:examples-lint', function() {
    runSequence(  'lint-js',
                  'lint-less',
                  'less-compile',
                  function() {
                    gulp.watch([config.component.lint.js], ['lint-js']);
                    gulp.watch([config.component.lint.less], ['lint-less']);
                  });
  });

  gulp.task('docs_lint-js', function() {
    return gulp.src(config.documentation.lint.js)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  });

  gulp.task('docs_watch', [
    'docs_lint-js',
  ], function() {
    gulp.watch(['./' + config.component.src + '/' + config.component.file], ['compile:js', 'docs_js_bundled', 'live_examples_js_bundled', 'test_page_js_bundled']);
    gulp.watch([config.documentation.lint.js], ['docs_lint-js']);
    gulp.watch([config.documentation.docs_bundle], ['docs_js_bundled']);
    gulp.watch([config.documentation.live_examples_bundle], ['live_examples_js_bundled']);
    gulp.watch([config.documentation.test_page_bundle], ['test_page_js_bundled']);
    gulp.watch([config.documentation.css], ['docs_css']);
    gulp.watch([config.documentation.markdown.files], ['docs_markdown']);
    gulp.watch([config.documentation.example.files], ['docs_files']);
  });

};
