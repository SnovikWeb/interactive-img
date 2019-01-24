const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

gulp.task('compile-css', () =>
    gulp.src('src/scss/**/*.scss')
        .pipe(sass({}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css/'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css/'))
);


gulp.task('compile-js', () =>
    gulp.src('src/js/**/*.js')
        .pipe(minify({
            noSource: false,
            ext: {
                min: '.min.js'
            },
        }))
        .pipe(gulp.dest('dist/js/'))
);

gulp.task('watch', gulp.parallel('compile-js', 'compile-css', () => {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('compile-css'));
    gulp.watch('src/js/**/*.js', gulp.parallel('compile-js'));
}));
