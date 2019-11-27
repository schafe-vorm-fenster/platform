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
const pushtosanity = require("../plugins/gulp-push-to-sanity")
const sanityeventplacereference = require("../plugins/gulp-determine-sanity-event-place-reference")
const sanityClient = require('@sanity/client')
const dotenv = require('dotenv').config()

const sanity_credentials = {
  "projectId": process.env.SANITY_PROJECTID,
  "token": process.env.SANITY_TOKEN,
	"dataset": 'production',
}

const client = sanityClient({
      projectId: sanity_credentials.projectId,
      dataset: sanity_credentials.dataset,
      token: sanity_credentials.token,
      useCdn: false
})


gulp.task('sanity:events:delete', function() {
	var yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString()
	const query = '*[_type == "event" && start < "'+ yesterday +'"]'
	return client.fetch(query).then(events => {
	  events.forEach(event => {
	    client.delete(event._id)
	  })
	})
});


gulp.task('sanity:events:push', function() {
	return gulp.src('_json/google/events/**/*.json')
	.pipe(jeditor(function(json) {
		// set datetime for date and datetime values for easier sorting
		if (json.start.hasOwnProperty('date')) {
			json.startDateTime = json.start.date + 'T00:00:00+02:00'
			json.allday = true
		} else{
			json.startDateTime = json.start.dateTime	
			json.allday = false
		}
		if (json.end.hasOwnProperty('date')) {
			json.endDateTime = json.end.date + 'T00:00:00+02:00'
			json.allday = true
		} else{
			json.endDateTime = json.end.dateTime	
			json.allday = false
		}
		const event = {
			_id: json.id,
			event_id: json.id,
			_type: 'event',
			name: json.summary,
			description: json.description,
			location: json.location,
			start: json.startDateTime,
			end: json.endDateTime,
			allday: json.allday
		}
		return event
	}))
	.pipe(sanityeventplacereference(sanity_credentials))
	.pipe(pushtosanity(sanity_credentials))
	.pipe(beautify({ indent_size: 2 }))
	.pipe(gulp.dest('_json/sanity/events'));
});


gulp.task('sanity:events', 
	gulp.parallel([
		'sanity:events:delete',
		'sanity:events:push'
	])
);