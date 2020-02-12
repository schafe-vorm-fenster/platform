"use strict";

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify-save-license', 'del']
    });

var markdownjson = require('gulp-marked-json');
var jeditor = require("gulp-json-editor");
var beautifyCode = require('gulp-beautify-code');
var rename = require("gulp-rename");
var data = require('gulp-data');
var del = require('del');


gulp.task('villages:clean', function() {
	return del('_json/villages/**');
});

gulp.task('villages:villages', function() {
	return gulp.src('./villages/**/*.md')
	.pipe(markdownjson())
	.pipe(jeditor(function(json) {
		var wrap = {}
		wrap['village'] = json;
		return wrap;
	}))
	.pipe(beautifyCode({indent_size: 2}))
	.pipe(rename(function (path) { path.extname = ".json"; } ))
	.pipe(gulp.dest('_json/villages/'));
});


gulp.task('villages', 
	gulp.series([
		'villages:clean',
		gulp.parallel([
			'villages:villages'
		])
	])
);
