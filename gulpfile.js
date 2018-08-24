var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');
var copy = require('gulp-copy');
var merge = require('merge-stream');

var jsDest = 'public/js/';
var jsSrc = 'src/js/';
var cssDest = 'public/css/';
var cssSrc = 'src/css/';

gulp.task('clean', function() {
  return del([
    'public/css/*',
    'public/js/*'
  ]);
});

gulp.task('buildjs', function() {
  return gulp.src([jsSrc + '/app.js', jsSrc + '/truffle-contract.min.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
})

gulp.task('buildcss', function() {
  return gulp.src([cssSrc + '/pure-min.css', cssSrc + '/grids-responsive-min.css', cssSrc + '/app.css'])
    .pipe(concat('app.css'))
    .pipe(gulp.dest(cssDest))
    .pipe(uglifycss())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(cssDest));
});

gulp.task('copy', function() {
  var truffle = gulp.src('node_modules/truffle-contract/dist/truffle-contract.min.js')
    .pipe(gulp.dest(jsSrc));

  var pure = gulp.src('node_modules/purecss/build/pure-min.css')
    .pipe(gulp.dest(cssSrc));

  var responsive = gulp.src('node_modules/purecss/build/grids-responsive-min.css')
    .pipe(gulp.dest(cssSrc));

  return merge(truffle, pure, responsive);
});
