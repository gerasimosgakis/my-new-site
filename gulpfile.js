const gulp = require('gulp');
const inject = require('gulp-inject');
const webserver = require('gulp-webserver');
const htmlclean = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');

const paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcSCSS: 'src/**/*.scss',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
    srcImgs: 'src/images/*',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',
    tmpImgs: 'tmp/images/',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js',
    distImgs: 'dist/images/'
}

gulp.task('html', () => {
    return gulp.src(paths.srcHTML)
            .pipe(gulp.dest(paths.tmp));
});

gulp.task("scss", function() {
    return gulp
      .src(paths.srcSCSS)
      .pipe(sass())
      .on("error", sass.logError)
      .pipe(
          autoprefixer({
              browsers: ["last 2 versions"]
          })
      )
      .pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('imgs', () => {
    return gulp.src(paths.srcImgs).pipe(gulp.dest(paths.tmpImgs));
});

gulp.task('copy', ['html', 'scss', 'js', 'imgs']);

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
    //   .pipe(htmlclean())
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

gulp.task('imgs:dist', () => {
    return gulp.src(paths.srcImgs)
      .pipe(gulp.dest(paths.distImgs));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], () => {
    const css = gulp.src(paths.distCSS);
    const js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);

gulp.task('clean', () => {
    del([paths.tmp, paths.dist]);
});