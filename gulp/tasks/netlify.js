"use strict";

var gulp = require("gulp");
var del = require('del');


gulp.task('netlifyClear', function() {
	return del('_site/_*');
});

gulp.task('netlifyCopy',
	function(done) {
		var netlify = 
			gulp.src('./src/netlify/*')
			.pipe(gulp.dest('./_site'));
		done();
	}
);

gulp.task('netlify', 
	gulp.series([
		'netlifyClear',
		'netlifyCopy'
	])
);
