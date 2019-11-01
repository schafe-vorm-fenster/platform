"use strict";

// load all gulp plugins
var requireDir = require('require-dir'),
    gulp = require('gulp'),
    wrench = require('wrench'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify-save-license', 'del']
    });
    // watch = require('gulp-watch');

// load all gulp task files
wrench.readdirSyncRecursive('./tasks').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./tasks/' + file);
});

gulp.task('build', 
	gulp.series([
		'villages',
		'calendars',
		'events'
	])
);

gulp.task('default',
	gulp.series([
		'build'
	])
);