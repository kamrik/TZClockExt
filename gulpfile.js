var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
watch = require('gulp-watch');
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
    gulp.src(['./bower_components/jquery/dist/jquery.js', './bower_components/jquery-ui/jquery-ui.js', './bower_components/jquery-ui/themes/smoothness/jquery-ui.css'])
        .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/scss/*.scss', ['sass']);
  gulp.watch('./src/**/*.{js,html,png,json}', ['static']);
});

gulp.task('default', ['static', 'sass'])
