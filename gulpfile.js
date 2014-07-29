var jshint = require('gulp-jshint');
var gulp = require('gulp');
var jade = require('gulp-jade');
var tsc = require('gulp-typescript-compiler');

var FOLDERS = {};
FOLDERS.CLIENT_TS_ROOT = 'app/ts';
FOLDERS.CLIENT_JS_ROOT = 'app/js';
FOLDERS.CLIENT_JADE_ROOT = 'app';
FOLDERS.SERVER_TYPESCRIPT_ROOT = 'server/ts';
FOLDERS.DIST = 'dist';

gulp.task('lint', function () {
	return gulp.src([
		'lib/**/*',
		'examples/*.js',
		'*.js'
	])
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }))
		.pipe(jshint.reporter('fail'));
});

gulp.task('buildDev', ['tsc', 'jade']
);

gulp.task('jade', function () {

	var YOUR_LOCALS = {};
	gulp.src(FOLDERS.CLIENT_JADE_ROOT + '/*.jade')
		.pipe(jade({
			locals: YOUR_LOCALS
		}))
		.pipe(gulp.dest(FOLDERS.CLIENT_JADE_ROOT))

});

gulp.task('tsc', function () {

	//client
	gulp.src([FOLDERS.CLIENT_TS_ROOT + '/*.ts'])
		//.pipe(tsc({ sourcemap: true,  module: 'amd',outDir: 'dist/client/'}))
		.pipe(tsc())
		.pipe(gulp.dest(FOLDERS.CLIENT_JS_ROOT));

	//server
	gulp.src([FOLDERS.SERVER_TYPESCRIPT_ROOT])
		.pipe(tsc({ sourcemap: true, module: 'amd', outDir: '/dist/client/' }))
		.pipe(gulp.dest('dist/client'));

});

/*
gulp.task('connect', connect.server({
	root: ['build'],
	port: 9000,
	livereload: true
}));*/
