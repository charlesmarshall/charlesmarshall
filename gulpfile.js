var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/sass'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('build/css'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('build/js/all.js'))
        .pipe(gulp.dest('./'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint', 'js']);
    gulp.watch('src/sass/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'js', 'watch']);