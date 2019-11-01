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

gulp.task('calendars:clean', function() {
	return del('_json/calendars/**');
});

gulp.task('calendars:calendars', function() {
	return gulp.src('./calendars/**/*.md')
	.pipe(markdownjson())
	.pipe(jeditor(function(json) {
		return json;
	}))
	.pipe(beautifyCode({indent_size: 2}))
	.pipe(rename(function (path) { path.extname = ".json"; } ))
	.pipe(gulp.dest('_json/calendars/'));
});

gulp.task('calendars:push', function() {
	return gulp.src('_json/calendars/**/*.json')
	.pipe(jeditor(function(json) {


		client.query(
		  q.Update(
		    q.Collection("Calendar"),
			    { 
			    	data: { 
			    		id: json.id,
			    		summary: json.summary,
			    		description: json.description
			    	} 
			    }
			)
		  )
		  .then((ret) => console.log(ret))


		return json
	}))
});


gulp.task('calendars', 
	gulp.series([
		'calendars:clean',
		gulp.parallel([
			'calendars:calendars'
		])
	])
);
