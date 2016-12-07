const gulp = require('gulp');

gulp.task('sass', function() {
  const sass = require('gulp-sass');

  gulp.src('src/reflect.scss')
    .pipe(sass({ errLogToConsole: true, includePaths: ['./node_modules'] }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch(['source/scss/**/*'], ['sass'])
});

gulp.task('build', ['sass']);
gulp.task('default', ['build', 'watch']);
