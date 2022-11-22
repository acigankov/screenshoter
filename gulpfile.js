const isDev = function () {
    return !argv.prod;
}

const isProd = function() {
    return !!argv.prod;
}

//Подключение плагинов
import gulp from 'gulp';
import argv from 'yargs';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import nunjucks from 'gulp-nunjucks';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import gcmq from 'gulp-group-css-media-queries';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import plumber from 'gulp-plumber';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import pngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import webp from 'gulp-webp';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
import fonter from 'gulp-fonter';
import { deleteAsync }  from 'del';

const webpackConf = {
    mode: isDev() ? 'development' : 'production',
    devtool: isDev() ? 'eval-source-map' : false,
    optimization: {
        minimize: false
    },
    output: {
        filename: 'custom.js',
    },
    module: {
        rules: []
    }
}

if(isProd()){
    webpackConf.module.rules.push({
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
    });
}

//Подключение файла настроек
import projectConfig from'./projectConfig.js';

//Значение путей проекта
const path = projectConfig.path;

//html
path.src.html[0] = path.src.srcPath + path.src.html[0];
path.src.html[1] = "!" + path.src.html[0].slice(0, -6) + "_*.html";
path.src.html[2] = "!" + path.src.srcPath + "/assets";
path.src.html[3] = "!" + path.src.srcPath + "/_html";
path.dist.html = path.dist.distPath + path.dist.html;

path.watch = {};
path.watch.html = [];
path.watch.html[0] = path.src.html[0];

//css
path.src.style[0] = path.src.srcPath + path.src.style[0];
path.dist.style = path.dist.distPath + path.dist.style;

path.watch.style = [];
path.watch.style[0]  = path.src.style[0].replace( path.src.style[0].split('/').pop(), '**/*.scss' );

//scripts
path.src.script[0] = path.src.srcPath + path.src.script[0];
path.dist.script = path.dist.distPath + path.dist.script;

path.watch.script = [];
path.watch.script[0] = path.src.script[0].replace( path.src.script[0].split('/').pop(), '**/*.js' );

//images
path.src.image[0] = path.src.srcPath + path.src.image[0];
path.src.image[1] = "!" + path.src.image[0].slice(0, -6) + "svgIcons/*.svg";
path.dist.image = path.dist.distPath + path.dist.image;

path.watch.image = [];
path.watch.image[0] = path.src.image[0];
path.watch.image[1] = "!" + path.src.image[0].slice(0, -6) + "svgIcons/*.svg";

//шрифты
path.src.font[0] = path.src.srcPath + path.src.font[0];
path.src.font[1] = "!" + path.src.font[0].slice(0, -6) + "src/*.*";

path.dist.font = path.dist.distPath + path.dist.font;

path.watch.font = [];
path.watch.font[0] = path.src.font[0];
path.watch.font[1] = "!" + path.src.font[0].slice(0, -6) + "src/*.*";

//libs
//scripts
path.src.libs[0] = path.src.srcPath + path.src.libs[0];
path.dist.libs = path.dist.distPath + path.dist.libs;


//Настройка задач
function browsersync () {
    browserSync.init({
        open: true,
        server: path.dist.distPath
    });
}

function test(done) {
    console.log(path.dist.html);
    done();
}

//Шаблонизатор Nunjucks
function njk() {
    return gulp.src(path.src.html)
        .pipe(nunjucks.compile())
        .pipe(gulp.dest(path.dist.html))
        .on('end', browserSync.reload)
}
//styles
function scss(){
    return gulp.src(path.src.style)
        .pipe(gulpif(isDev(), sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpif(isProd(), autoprefixer({
            grid: true
        })))
        .pipe(gulpif(isProd(), gcmq()))
        .pipe(gulpif(isDev(), sourcemaps.write()))
        .pipe(gulpif(isProd(), gulp.dest(path.dist.style)))
        .pipe(gulpif(isProd(), csso()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.dist.style))
        .pipe(browserSync.reload({stream: true}))
}

//script
function script(){
    return gulp.src(path.src.script)
        .pipe(plumber())
        .pipe(webpackStream(webpackConf, webpack))
        .pipe(gulpif(isProd(), gulp.dest(path.dist.script)))
        .pipe(gulpif(isProd(), uglify()))
        .pipe(concat('custom.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.dist.script))
        .pipe(browserSync.reload({stream: true}))
}

//images
function imageMin(){
    return gulp.src(path.src.image)
        .pipe(newer(path.dist.image))
        .pipe(imagemin([

            imageminJpegRecompress({
                progressive: true,
                min: 70, max: 75
            }),

            pngquant({
                speed: 5,
                quality: [0.6, 0.8]
            }),

            imageminSvgo({
                plugins: [
                    { removeViewBox: false },
                    { removeUnusedNS: false },
                    { removeUselessStrokeAndFill: false },
                    { cleanupIDs: false },
                    { removeComments: true },
                    { removeEmptyAttrs: true },
                    { removeEmptyText: true },
                    { collapseGroups: true }
                ]
            })
        ]))
        .pipe(gulp.dest(path.dist.image))
}

function webConverter(){
    return gulp.src(path.dist.image + '**/*.{png,jpg,jpeg}')
        .pipe(webp())
        .pipe(gulp.dest(path.dist.image))
}

//fonts
function ttf2woff2Converter(){
    return gulp.src(path.src.font[0].slice(0, -6) + "src/*.ttf")
        .pipe(ttf2woff2())
        .pipe(gulp.dest(path.src.font[0].slice(0, -6)));
}

function ttf2woffConverter(){
    return gulp.src(path.src.font[0].slice(0, -6) + "src/*.ttf")
        .pipe(ttf2woff())
        .pipe(gulp.dest(path.src.font[0].slice(0, -6)));
}

function otf2ttf(){
    return gulp.src(path.src.font[0].slice(0, -6) + "src/*")
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(gulp.dest(path.src.font[0].slice(0, -6) + "src"));
}

function font() {
    return gulp.src(path.src.font)
        .pipe(gulp.dest(path.dist.font))
        .on('end', browserSync.reload);
}

//cleaning dist folder
function clean(){
    return deleteAsync([path.dist.distPath]);
}

//copy libs in dist
function copyLibs() {
    return gulp.src(path.src.libs)
        .pipe(gulp.dest(path.dist.libs));
}

//Слежение за файлами
function watch(){
    gulp.watch(path.watch.html, njk);
    gulp.watch(path.watch.style, scss);
    gulp.watch(path.watch.script, script);
    gulp.watch(path.watch.image, image);
    gulp.watch(path.watch.font, font);
}

//Запуск
const image = gulp.series(imageMin, webConverter, (done) => {browserSync.reload(); done();});
const fontsConvert = gulp.series(otf2ttf, ttf2woff2Converter, ttf2woffConverter);

export default gulp.series(
    gulp.parallel(clean),
    gulp.parallel(copyLibs),
    gulp.parallel(njk, scss, script, image, font),
    gulp.parallel(browsersync, watch),
    imageMin,
    webConverter,
);

export { fontsConvert };