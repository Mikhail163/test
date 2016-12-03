var gulp      = require('gulp');
var concatCss = require('gulp-concat-css');
var cleanCSS  = require('gulp-clean-css');
var rename    = require('gulp-rename');
 
 
gulp.task('default', function () {
  return gulp.src(['css/*.css', 'bootstrap/css/bootstrap.min.css'])
    .pipe(concatCss("main.css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('styles/'));
});