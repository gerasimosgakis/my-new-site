const gulp = require('gulp');
const inject = require('gulp-inject');
const webserver = require('gulp-webserver');
const htmlclean = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
}

gulp.task('html', () => {
    return gulp.src(paths.srcHTML)
            .pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'css', 'js']);

gulp.task('inject', ['copy'], () => {
    const css = gulp.src(paths.tmpCSS);
    const js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], () => {
    return gulp.src(paths.tmp)
      .pipe(webserver({
        port: 3000,
        livereload: true
      }));
});

gulp.task('watch', ['serve'], () => {
    gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['watch']);

gulp.task('html:dist', () => {
    return gulp.src(paths.srcHTML)
      .pipe(htmlclean())
      .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', () => {
    return gulp.src(paths.srcCSS)
      .pipe(concat('style.min.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', () => {
    return gulp.src(paths.srcJS)
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], () => {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);

gulp.task('clean', () => {
    del([paths.tmp, paths.dist]);
});