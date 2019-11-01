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
var pushtosanity = require("../plugins/gulp-push-to-sanity");
const sanityClient = require('@sanity/client')
require('dotenv').config();

// const credentials = JSON.parse(fs.readFileSync('Schafe-vorm-Fenster-f85d38f06aa2.json', 'utf8'));
const credentials = {
	"private_key": JSON.parse(`"${process.env.GOOGLEAPI_PRIVATE_KEY}"`),
	"client_email": process.env.GOOGLEAPI_CLIENT_EMAIL
}

const sanity_credentials = {
	"projectId": 'gzgufr8h',
	"dataset": 'production',
	"token": 'skVOB0wWEG7zqtFqLtMWV0VGnqZCzDoPbUuwVtilpmdxPSJtCCNg8wNJmGSwNYubFi00wCyAocAntwufWuwsQrQPk2GMDvsFNgAEPTz3jIABdbNqK4kr1LimIxB5LXxjPtYuQ3vlvLzG2Yj8kiRXbesq3lR4D0kzK0hD1M00Yx5IpO05IqjQ'
}


gulp.task('sanity:events:clean', function() {
	return del(['_json/sanity/events/**','_json/sanity/events.json']);
});


async function getCommunity(name) {
			const client = sanityClient({
      projectId: sanity_credentials.projectId,
      dataset: sanity_credentials.dataset,
      token: sanity_credentials.token,
      useCdn: false
    })
		const query = '*[_type == "community" && name == "'+name+'"]'
		var item
    const myvillage =	await client.fetch(query, {}).then(function(response) {
  		if(response && response.length > 0) {
  			const item = response[0]
  			return Promise.resolve(item)
  		}
  		return Promise.resolve(null)
  	})

		if (myvillage) {
			return Promise.resolve(myvillage._id)
		}
		return Promise.resolve(null)
}


gulp.task('sanity:events:get', function() {
	return gulp.src('_json/sanity/calendars/**/*.json')
	.pipe(jeditor(function(json) {
		json.id = json.calendar_id
		return json
	}))
	.pipe(googleevents(credentials))
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
	.pipe(jeditor(function(json) {
		

		let response
		const request = async () => {
		  response = await getCommunity(json.community);
		  console.log('aaaa')
		  console.log(response);
		}
		request();
		console.log('bbbb')
		console.log(response);




		let community_ref_id
		
		// getCommunity(json.community).then(refid => {
		// 	console.log('id: ' + refid)
		// 	json.community_id = refid
		// 	console.log(json)
		// 	community_ref_id = refid
		// })
		// console.log('community_ref_id: ' + community_ref_id)

		// client.fetch(query, params).then(communities => {
		// 	console.log('first item')
		//   communities.forEach(community => {
		//     console.log(`${community.name} (${community._id} id)`)
		//     console.log(community._id)
		// 		community_ref_id = community._id

		// 		console.log ('1 ------------')
		// 		console.log (community_ref_id)
		// 		return null
		//   })
		// })
		// console.log ('2 ------------')
		// community_ref_id
		// console.log (community_ref_id)
		// json.community_id = community_ref_id
		// console.log (json)
		return json
	}))
	.pipe(beautify({ indent_size: 2 }))
	.pipe(gulp.dest('_json/sanity'));
});


gulp.task('sanity:events:push', function() {
	return gulp.src('_json/sanity/events/**/*.json')
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
			allday: json.allday,
			community: {
				"_type": "reference",
				"_ref": "114c842b-f307-4768-b70d-d5b4b3ee1a93",
				"_weak": true
			}
		}
		return event
	}))
	.pipe(pushtosanity(sanity_credentials,'event'))
});


gulp.task('sanity:events', 
	gulp.series([
		'sanity:events:clean',
		'sanity:events:get',
		'sanity:events:push'
	])
);