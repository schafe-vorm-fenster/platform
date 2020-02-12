"use strict";

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify-save-license', 'del']
    })

var markdownjson = require('gulp-marked-json')
var jeditor = require("gulp-json-editor")
var beautifyCode = require('gulp-beautify-code')
var rename = require("gulp-rename")
var data = require('gulp-data')
var del = require('del')
var fs = require('fs')
var request = require('request')
var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var split = require("../plugins/gulp-split-array")
var buffer = require('vinyl-buffer')
var dotenv = require('dotenv').config()

const sanity_credentials = {
  "projectId": process.env.SANITY_PROJECTID,
  "token": process.env.SANITY_TOKEN
}

const dataset = 'production'
const query = '*[_type=="calendar"]'
const uri = 'https://' + sanity_credentials.projectId + '.api.sanity.io/v1/data/query/' + dataset + '?query=' + encodeURI(query)

gulp.task('sanity:calendars:clean', function() {
	return del('_json/sanity/calendars/*');
});

gulp.task('sanity:calendars:get', function() {
	return request({
		method: 'GET',
		uri: uri,
		auth: {
			bearer: sanity_credentials.token
    }
	})
  .pipe(source('sanity_calendars.json'))
  .pipe(buffer())
  .pipe(split('result','calendar_id'))
  .pipe(gulp.dest('_json/sanity/calendars/'))
});

gulp.task('sanity:calendars', 
	gulp.series([
		'sanity:calendars:clean',
		gulp.parallel([
			'sanity:calendars:get'
		])
	])
);
