var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    jsonMinify = require('gulp-json-minify'),
    browserify = require('gulp-browserify');


var env,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development';
    sassSources = 'expanded';
} else {
    outputDir = 'builds/production';
    sassSources = 'compressed';
}

jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = ['builds/development/*.html'];
jsonSources = ['builds/development/js/*json'];

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        //.pipe(browserify())
        //.pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            css: outputDir + '/css',
            image: outputDir + '/images',
            sourcemap: true,
            style: sassStyle
        })
            .on('error', gutil.log))
        .pipe(gulp.dest(outputDir + '/css'))
        .pipe(connect.reload())
});


gulp.task('html', function() {
    gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonMinify()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + '/js')))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/**/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir + '/',
        livereload: true,
        open: true
    })
});

gulp.task('default', ['html', 'json', 'js', 'compass', 'connect', 'watch']);