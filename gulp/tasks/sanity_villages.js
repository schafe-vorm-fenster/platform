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
var fs = require('fs');
var request = require('request');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var split = require("../plugins/gulp-split-array");
var buffer = require('vinyl-buffer');
var combine = require('gulp-concat-json-to-array');
const beautify = require('gulp-jsbeautifier');


const projectId = 'gzgufr8h'
const dataset = 'production'
const token = 'skVOB0wWEG7zqtFqLtMWV0VGnqZCzDoPbUuwVtilpmdxPSJtCCNg8wNJmGSwNYubFi00wCyAocAntwufWuwsQrQPk2GMDvsFNgAEPTz3jIABdbNqK4kr1LimIxB5LXxjPtYuQ3vlvLzG2Yj8kiRXbesq3lR4D0kzK0hD1M00Yx5IpO05IqjQ'
const query = '*[_type=="community"]'
const uri = 'https://' + projectId + '.api.sanity.io/v1/data/query/' + dataset + '?query=' + encodeURI(query)

gulp.task('sanity:community:clean', function() {
	return del('_json/sanity/community/*');
});

gulp.task('sanity:community:get', function() {
	return request({
		method: 'GET',
		uri: uri,
		auth: {
			bearer: token
    }
	})
  .pipe(source('sanity_community.json'))
  .pipe(buffer())
  .pipe(split('result','name'))
  .pipe(jeditor(function(json) {
    json.slug = json.slug.current
    return json
  }))
  .pipe(combine('communities.json',function(data, meta){ 
    // console.log('---');
    // console.log(data);
    // console.log('---');
    // console.log(meta);
    return new Buffer.from(JSON.stringify(data));
  }))
  .pipe(beautify({ indent_size: 2 }))
  .pipe(gulp.dest('_json/sanity/community/'))
});

gulp.task('sanity:community', 
	gulp.series([
		'sanity:community:clean',
		gulp.parallel([
			'sanity:community:get'
		])
	])
);
