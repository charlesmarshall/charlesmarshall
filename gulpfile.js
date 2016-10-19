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
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('dist/js/all.js'))
        .pipe(gulp.dest('./'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

// images
gulp.task('images', function() {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('dist/img/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint', 'js']);
    gulp.watch('src/sass/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'js', 'images']);