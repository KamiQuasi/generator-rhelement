const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const del = require('del');
const fs = require('fs');
let watcher;

gulp.task('clean', () => {
  return del(['./*.compiled.*'])
});

gulp.task('sass', () => {
  return gulp.src(['./*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./'));
});

gulp.task('replaceStyles', () => {
  return gulp.src('./<%= elementName %>.js')
    .pipe(replace(/<style>[\s\S]*<\/style>/g, '<style>' + fs.readFileSync('./<%= elementName %>.css') + '</style>'))
    .pipe(gulp.dest('./'));
});

gulp.task('compile', () => {
  return gulp.src(['./*.js', '!./gulpfile.js'])
    .pipe(replace(/(import ["'].*).(js["'];?)/g, '$1.compiled.$2'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({
      suffix: ".compiled"
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('stopwatch', done => {
  watcher.close();
  done();
});

gulp.task('watch', () => {
  watcher = gulp.watch(['./<%= elementName %>.js', './*.scss'], gulp.series('stopwatch', 'sass', 'replaceStyles', 'clean', 'compile', 'watch'));
  return watcher;
});

gulp.task('default',
  gulp.series('clean', 'sass', 'replaceStyles', 'compile')
);

gulp.task('dev',
  gulp.series('default', 'watch')
);
