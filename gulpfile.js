var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserify = require('browserify');

var bundle = function(relpath) {
  return browserify({
    entries: [relpath],
    transform: [
      [
        'babelify', {
          presets: [
            'es2015'
          ],
          sourceMaps: true
        }
      ]
    ],
    debug: true
  })
  .bundle();
};
var browserifyBuffer = function(_bundle, minify, theSource) {
  var stream = _bundle
    .pipe(source(theSource))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }));

  if (minify) {
    stream.pipe(uglify());
  }

  stream
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'))
    .on('end', function() {
      console.log('File compiled & save.');
    });
};

gulp.task('default', function() {
  return browserifyBuffer(
    bundle('./src/index.js'),
    true,
    'index.js'
  );
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['default']);
});