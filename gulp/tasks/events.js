"use strict";

var gulp = require("gulp");
var markdownjson = require('gulp-marked-json');
var jeditor = require("gulp-json-editor");
var beautifyCode = require('gulp-beautify-code');
const beautify = require('gulp-jsbeautifier');
var rename = require("gulp-rename");
var data = require('gulp-data');
var combine = require('gulp-concat-json-to-array');
var del = require('del');
var fs = require('fs');
var stream = require('string-to-stream');
var readline = require('readline');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var googleevents = require('gulp-google-calendar-events');
require('dotenv').config();

// const credentials = JSON.parse(fs.readFileSync('Schafe-vorm-Fenster-f85d38f06aa2.json', 'utf8'));
const credentials = {
	"private_key": JSON.parse(`"${process.env.GOOGLEAPI_PRIVATE_KEY}"`),
	"client_email": process.env.GOOGLEAPI_CLIENT_EMAIL
}

gulp.task('events:clean', function() {
	return del(['_json/events/**','_json/events.json']);
});

gulp.task('events:get', function() {
	return gulp.src('_json/calendars/**/*.json')
	.pipe(googleevents(credentials))
	.pipe(jeditor(function(json) {
		// set short location
		if (json.location && json.location.includes(',')) { 
			json.localLocation = json.location.split(',')[0]
		}else{
			json.localLocation = json.location
		}
		// set datetime for date and datetime values for easier sorting
		if (json.start.hasOwnProperty('date')) {
        	json.startDateTime = json.start.date + 'T00:00:00+02:00'
    	} else{
    		json.startDateTime = json.start.dateTime	
    	}
		return json
	}))
	.pipe(beautify({ indent_size: 2 }))
	.pipe(gulp.dest('_json/'));
});

gulp.task('events:combine', function() {
	return gulp.src('_json/events/**/*.json')
	.pipe(combine('events.json',function(data, meta){ 
		// console.log('---');
		// console.log(data);
		// console.log('---');
		// console.log(meta);
		return new Buffer.from(JSON.stringify(data));
	}))
	.pipe(jeditor(function(json) {
		var wrap = {}
		wrap['events'] = json;
		return wrap;
	}))
	.pipe(beautify({ indent_size: 2 }))
	// .pipe(rename("events.json"))
	.pipe(gulp.dest('_json'));
});

gulp.task('events', 
	gulp.series([
		'events:clean',
		'events:get',
		'events:combine'
	])
);