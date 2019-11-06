"use strict";

const gulp = require("gulp")
const markdownjson = require('gulp-marked-json')
const jeditor = require("gulp-json-editor")
const beautifyCode = require('gulp-beautify-code')
const beautify = require('gulp-jsbeautifier')
const rename = require("gulp-rename")
const data = require('gulp-data')
const combine = require('gulp-concat-json-to-array')
const del = require('del')
const fs = require('fs')
const stream = require('string-to-stream')
const readline = require('readline')
const source = require('vinyl-source-stream')
const streamify = require('gulp-streamify')
const googleevents = require('gulp-google-calendar-events')
const pushtosanity = require("../plugins/gulp-push-to-sanity")
const sanityClient = require('@sanity/client')
const dotenv = require('dotenv').config()

// const credentials = JSON.parse(fs.readFileSync('Schafe-vorm-Fenster-f85d38f06aa2.json', 'utf8'));
const google_credentials = {
	"private_key": JSON.parse(`"${process.env.GOOGLEAPI_PRIVATE_KEY}"`),
	"client_email": process.env.GOOGLEAPI_CLIENT_EMAIL
}


gulp.task('google:events:clean', function() {
	return del(['_json/google/events/**','_json/google/events.json']);
});

gulp.task('google:events:get', function() {
	return gulp.src('_json/sanity/calendars/**/*.json')
	.pipe(jeditor(function(json) {
		json.id = json.calendar_id
		return json
	}))
	.pipe(googleevents(google_credentials))
	.pipe(jeditor(function(json) {
		// set short location
		if (json.location && json.location.includes(',')) { 
			const locationArray = json.location.split(',')
			json.localLocation = locationArray[0]
			if(locationArray.length == 4)
				json.community = json.location.split(',')[1]
			if(locationArray.length == 3)
				json.community = json.location.split(',')[0]
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
	.pipe(gulp.dest('_json/google'));
});

gulp.task('google:events', 
	gulp.series([
		'google:events:clean',
		'google:events:get'
	])
);