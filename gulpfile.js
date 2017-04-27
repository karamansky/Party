"use strict";

//init package
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const browserSync  = require('browser-sync');
const cssnano			 = require('gulp-cssnano'); // Подключаем пакет для минификации CSS
const rename 			 = require('gulp-rename');
const concat  		 = require('gulp-concat');
const uglify 			 = require('gulp-uglifyjs'); // Подключаем uglifyjs (для сжатия JS)
const pngquant		 = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
const cache				 = require('gulp-cache');				// кеширует изображения
const autoprefixer = require("gulp-autoprefixer");// Подключаем библи`отеку для автоматического добавления префиксов
const imagemin		 = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
const del		 			 = require('del'); // Подключаем библиотеку для удаления файлов и папок
const bourbon      = require('node-bourbon'); // Подключаем библиотеку миксинов для SASS

/*tasks*/

// sass to css
gulp.task("sass", function(){
  return gulp.src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({
			includePaths: bourbon.includePaths
		})
		 // .on('error', sass.logError)) //перехватываем ошибки
		)
		.pipe(autoprefixer({browsers: ['last 10 versions'], cascade: false}))
    .pipe(gulp.dest("src/css")) //нельзя писать файл. Нужно только папки
    .pipe(browserSync.reload({
			stream: true
		}));
});

// reload browser
gulp.task("browserSync", function(){
  browserSync({
    server: {
      baseDir: './src' //папка с исходными файлами проекта
    },
    notify: false
  });
});

//compress and cached images
gulp.task('img', function(){
	return gulp.src("src/images/**/*")
			.pipe(cache(imagemin({
				interlaced:		true,
				progressive:	true,
				svgoPlugins:	[{removeViewBox: false}],
				une:					[pngquant()]
			})))
			.pipe(gulp.dest("dist/images"));
});

//очистка Cache
gulp.task("clearCache", function(){
	return cache.clearAll();
});

//concat and minification js libs
gulp.task("minJsLibs", function(){
	del.sync("src/js/libs.min.js"); // удаляем старую сборку
	return gulp.src([
		//'src/libs/bootstrap-sass/assets/javascripts/bootstrap.min.js',
		'src/libs/jquery/dist/jquery.min.js'])
		// 'src/libs/owl-carousel/owl-carousel/owl.carousel.min.js',
		// 'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js'])
			.pipe(concat("libs.min.js")) // собираем все библиотеки в один файл
			// .pipe(uglify()) // сжимаем
			.pipe(gulp.dest("src/js"));
});

//concat and minification css libs
gulp.task("minCssLibs", ['sass'], function(){
	return gulp.src([
		'src/css/libs.css',
		'src/css/header.css'
		// 'src/libs/owl-carousel/owl-carousel/owl.carousel.css'
	])
			.pipe(cssnano()) // сжимаем
			.pipe(rename({
				suffix: '.min'
			})) // добавляет суффикс .min
			.pipe(gulp.dest("src/css"));
});

//remove dist folder
gulp.task("remove", function(){
		return del.sync("dist"); // Удаляем папку dist перед сборкой
});

gulp.task("watch", ['minJsLibs', 'sass', 'minCssLibs', 'browserSync'], function(){
	gulp.watch("src/sass/**/*.+(scss|sass)", ['sass']); //массив запускаемых тасков
	gulp.watch("src/**/*.+(html|php)", browserSync.reload);
	gulp.watch("src/js/**/*.js", browserSync.reload);
});

//собираем проект в продакшн
gulp.task("build", ['remove', 'img', 'sass', 'minJsLibs'], function(){
	var buildCss = gulp.src("src/css/*").pipe(gulp.dest("dist/css"));

	var buildFonts = gulp.src("src/fonts/**/*")
			.pipe(gulp.dest("dist/fonts"));

	var buildJs = gulp.src("src/js/**/*")
			.pipe(gulp.dest("dist/js"));

	var buildHtml = gulp.src("src/*.html")
			.pipe(gulp.dest("dist/"));
});

//default gulp task call watch
gulp.task('default', ['watch']);