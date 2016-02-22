var gulp 			= require('gulp');
var less 			= require('gulp-less');
var livereload		= require('gulp-livereload');
var connect 		= require('gulp-connect');
var minifyCss		= require('gulp-minify-css');
var autoprefixer	= require('gulp-autoprefixer');
var image 			= require('gulp-image');
var gutil 			= require('gulp-util');
var uglify 			= require('gulp-uglifyjs');
var concat 			= require('gulp-concat');
var jshint 			= require('gulp-jshint');
var rename 			= require('gulp-rename');


// static webserver
gulp.task('webserver', function(){
	connect.server({
		root: '../code/',
		port: 9050,
		livereload: true
	});
});

gulp.task('html', function(){
	gulp.src('*.html')
		.pipe(connect.reload());
});

gulp.task('css', function(){
	gulp.src('public/css/*.css')
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('public/css/main.min.css'));
});

gulp.task('less', function(){
	return gulp.src('source/less/*.less')
		.pipe(less({
			sourceMap: {
				sourceMapRootpath: 'source/less/*.less'
			}
			}).on('error', function(error){
				gutil.log(gutil.colors.red(error.message))
				notifer.notify({
					title: 'Less compilation error',
					message: error.mesage
					})
				}))
		.pipe(autoprefixer({
			browser: ['last 2 version'],
			cascade: false
			}))
		.pipe(gulp.dest('public/css/main.css'))
		.pipe(connect.reload());
});

gulp.task('boot-lib', function(){
	gulp.src('dist/only-js/*.js')
		.pipe(uglify('all.js', {
			outSourceMap: true
			}))
		.pipe(gulp.dest('public/js/'));
});

gulp.task('js-only', function(){
	gulp.src('source/js/*.js')
		.pipe(uglify('all.js', {
			outSourceMap: true
			}))
		.pipe(gulp.dest('public/js/all.js'));
});

gulp.task('lint', function(){
	return gulp.src(['source/js/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('minify-css', function(){
	return gulp.src('public/css/*.css')
	.pipe(minifyCss({
		compatibility: 'ie8'
		}))
	.pipe(rename({
		suffix: '.min'
		}))
	.pipe(gulp.dest('public/css'));
});

gulp.task('images', function(){
	return gulp.src('public/img/*')
		.pipe(image({
			pngquant: true,
      		optipng: false,
      		zopflipng: true,
      		advpng: true,
      		jpegRecompress: false,
      		jpegoptim: true,
      		mozjpeg: true,
      		gifsicle: true,
      		svgo: true
		}))
		.pipe(gulp.dest('public/img-min/'));
});

// gulp.task('compress', function(){
// 	gulp.src('public/css/*.css')
// 		.pipe(gzip())
// 		.pipe(gulp.dest('public/css/'));
// });

gulp.task('watch', function(){
	gulp.watch('source/less/*.less', ['less']);
	gulp.watch(['*.html'], ['html']);
	gulp.watch(['public/css/*.css'], ['css']);
	gulp.watch('dist/only-js/*.js', ['boot-lib']);
	gulp.watch('source/js/*.js', ['js-only']);
	gulp.watch('source/less/*.less', ['default']);
	gulp.watch('public/img/*', ['images']);
});

gulp.task('default', ['less', 'webserver', 'watch', 'boot-lib', 'js-only' /*, 'compress', 'images', 'minify-css'*/]);



