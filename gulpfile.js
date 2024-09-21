const browserSync = require('browser-sync').create();
const {src, dest, watch, parallel, series} = require('gulp');
const uglify = require('gulp-uglify-es').default;
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const clean = require('gulp-clean');

// вместо gulp-autoprefixer
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');



function scripts() {
	return src([
		// 'node_modules/swiper/swiper-bundle.js',
		'app/js/main.js',

		// 'app/js/*.js',  // все файлы js в папке js
		// 'app/libs/**/*.js',  // все js во всех папках в папке libs
		// '!app/js/main.min.js'  // исключая файл
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

// файлы стилей дополнительных библиотек подключаем через @import в файле style.scss
function styles() {
	return src('app/scss/style.scss')
		.pipe(postcss([
      autoprefixer({
        overrideBrowserslist: ['last 10 versions'] // Настраиваем поддержку последних 10 версий браузеров
      })
    ]))
		.pipe(concat('style.min.css'))
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

// наблюдение за изменением файлов
function watching() {
	watch(['app/scss/style.scss'], styles)
	watch(['app/js/main.js'], scripts)
	watch(['app/*.html']).on('change', browserSync.reload)
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
}

// очищает папку dist
function cleanDist() {
	return src('dist')
		.pipe(clean())
}

function building() {
	return src([
		'app/css/style.min.css',
		'app/js/main.min.js',
		'app/**/*.html'
	], {base : 'app'})       //  сохраняет структуру папок
		.pipe(dest('dist'))    //  копирует всё в папку dist
}


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
// последовательная серия, сначало удаление потом очистка
exports.build = series(cleanDist, building);

exports.default = parallel(styles, scripts, watching, browsersync)  // паралельное выполнение тасков