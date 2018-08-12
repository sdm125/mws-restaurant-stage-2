const gulp  = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglifyjs = require('gulp-uglify-es').default;;
const uglifycss = require('gulp-uglifycss');
const gzip = require('gulp-gzip');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');

gulp.task('dist', [
  'copy-html',
  'minify-imgs',
  'styles-dist',
  'scripts-dist',
  'copy-readme'
]);

gulp.task('minify-imgs', function() {
  gulp.src('img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

// Tranpile ES6 to ES5, concat all js files, minify
gulp.task('scripts-dist', function() {
  // Main
  gulp.src(['js/dbhelper.js', 'js/idb.js', 'js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(babel({ presets: ['es2015-script'] }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglifyjs())
    .pipe(gzip())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'));

  // Restaurant
  gulp.src(['js/dbhelper.js', 'restaurant_info.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('restaurant_info.min.js'))
    .pipe(babel({ presets: ['es2015-script'] }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglifyjs())
    .pipe(gzip())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'));
  // Copy and minify service worker
  gulp.src('./sw.js')
    .pipe(sourcemaps.init())
    .pipe(uglifyjs())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

// Concat all CSS. Add vendor prefixes. Minify.
gulp.task('styles-dist', function() {
  gulp.src('css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(uglifycss())
    .pipe(gzip())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-html', function() {
  gulp.src('./index.html')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('./dist'));
  gulp.src('./restaurant.html')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-readme', function() {
  gulp.src('/README.md')
    .pipe(gulp.dest('./dist'));
});
