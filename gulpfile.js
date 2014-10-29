var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var del = require('del');


var buildDir = path.join(__dirname, 'build');
var srcDir = path.join(__dirname, 'src');


var pkg = require('./package.json');

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});


gulp.task('sass', function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('static', function () {
    gulp.src('./src/**/*.{js,html,png,json}')
        .pipe(gulp.dest('./dist/'));
});

// Just copy the needed file from libs in bower_components.
gulp.task('lib', function() {
    gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/jquery-ui/ui/core.js',
        './bower_components/jquery-ui/ui/datepicker.js',
        './bower_components/jquery-ui/themes/smoothness/jquery-ui.css',
        './bower_components/fontawesome/fonts/fontawesome-webfont.woff'
        ])
        .pipe(gulp.dest('./dist/lib/'));
    // The images for left / fight icons on the calendar.
    var imgsDir = './bower_components/jquery-ui/themes/smoothness/images/';
    gulp.src([imgsDir + 'ui-icons_{222222,454545}_256x240.png', imgsDir + 'ui-bg_*75*.png'])
        .pipe(gulp.dest('./dist/lib/images/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/scss/*.scss', ['sass']);
  gulp.watch('./src/**/*.{js,html,png,json}', ['static']);
});

gulp.task('default', ['static', 'sass'])
