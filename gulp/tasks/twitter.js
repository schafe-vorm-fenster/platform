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

var keys = {
    consumer_key : "PZtRVembNOhlZOE0mdaSIQPFN",
    consumer_secret : "NmSDi7SafBYXFBHb7p33R682r5w7Hg1izo7WCmOgfwGV1Mfe7S",
    token : "97170324-iszgq5AE1ZRxSRCxCgVrM5ALLTdovIMvwsiQwF7co",
    token_secret : "dD0Uu4mYSG0YL7kQZSLRzkzMTT1ZEbSF0SYPRHINp1KpA"
};

gulp.task('twitter:clean', function() {
	return del('_json/twitter.json');
});

gulp.task('twitter:tweets', function() {
	return request({
		method: 'GET',
		uri: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=schafeamfenster&result_type=recent&count=60&tweet_mode=extended',
		oauth: {
			consumer_key: 'PZtRVembNOhlZOE0mdaSIQPFN',
			consumer_secret: 'NmSDi7SafBYXFBHb7p33R682r5w7Hg1izo7WCmOgfwGV1Mfe7S',
			token: '97170324-iszgq5AE1ZRxSRCxCgVrM5ALLTdovIMvwsiQwF7co',
			token_secret: 'dD0Uu4mYSG0YL7kQZSLRzkzMTT1ZEbSF0SYPRHINp1KpA'
        },
        result_type: 'recent'
	})
	.pipe(source('twitter.json'))
	.pipe(streamify(jeditor(function(json) {
		var wrap = {}
		wrap['twitter'] = json;
		return wrap;
	})))
	.pipe(beautifyCode({indent_size: 2}))
	.pipe(gulp.dest('_json/'));
});

gulp.task('twitter', 
	gulp.series([
		'twitter:clean',
		gulp.parallel([
			'twitter:tweets'
		])
	])
);
