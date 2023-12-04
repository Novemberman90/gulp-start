const { src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
//const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function scripts() {
    return src ([
        'app/js/main.js',
    ])
    //  src ([ 'node_modules\swiper\swiper-bundle.js', 'app/js/main.js',]) 
    // Так записываем когда нужно подключить несколько файлов js. Ситили аналогично, но лучше делать Import в scss
    // Пример когда нужно поключить все js, но кроме освновного, чтобы не зависнуть в цикле
    // 'app/js/*.js', - подключает всё файлы .js
    //'!app/js/main.min.js' - кроме этого
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
    return src ('app/scss/styles.scss')
    /*.pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))*/
    .pipe(concat('styles.min.scss'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
    
}


function watching(){
    watch(['app/scss/styles.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload); // app/**/*.html - вот так найдёт абсолютно все html

}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function building() {
    return src([
        'app/css/styles.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base : 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, watching);