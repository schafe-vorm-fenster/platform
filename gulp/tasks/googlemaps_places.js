"use strict";

var gulp = require("gulp"),
  $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "uglify-save-license", "del"],
  });

var jeditor = require("gulp-json-editor");
var del = require("del");
var request = require("request");
var source = require("vinyl-source-stream");
var split = require("../plugins/gulp-split-array");
var buffer = require("vinyl-buffer");
var combine = require("gulp-concat-json-to-array");
const beautify = require("gulp-jsbeautifier");
const patchtosanity = require("../plugins/gulp-patch-to-sanity");
const googlemapsfindplacefromtext = require("../plugins/gulp-googlemaps-findplacefromtext");
const googlemapsplacedetails = require("../plugins/gulp-googlemaps-placedetails");
const determinesanitycommunityreference = require("../plugins/gulp-determine-sanity-community-reference");
const sanityClient = require("@sanity/client");
const slugify = require("slugify");

const projectId = "gzgufr8h";
const dataset = "production";
const token =
  "skVOB0wWEG7zqtFqLtMWV0VGnqZCzDoPbUuwVtilpmdxPSJtCCNg8wNJmGSwNYubFi00wCyAocAntwufWuwsQrQPk2GMDvsFNgAEPTz3jIABdbNqK4kr1LimIxB5LXxjPtYuQ3vlvLzG2Yj8kiRXbesq3lR4D0kzK0hD1M00Yx5IpO05IqjQ";
const query = '*[_type=="place"]';
const uri =
  "https://" +
  projectId +
  ".api.sanity.io/v1/data/query/" +
  dataset +
  "?query=" +
  encodeURI(query);

const sanity_credentials = {
  projectId: process.env.SANITY_PROJECTID,
  token: process.env.SANITY_TOKEN,
  dataset: "production",
};

const client = sanityClient({
  projectId: sanity_credentials.projectId,
  dataset: sanity_credentials.dataset,
  token: sanity_credentials.token,
  useCdn: false,
});

gulp.task("googlemaps:addresses:clean", function () {
  return del("_json/googlemaps/addresses/*");
});

gulp.task("googlemaps:places:clean", function () {
  return del("_json/googlemaps/places/*");
});

gulp.task("googlemaps:addresses:collectfrombrokenevents", function () {
  return gulp
    .src("_json/sanity/events/missingplace/*.json")
    .pipe(
      jeditor(function (json) {
        return {
          address: json.address ? json.address : json.location,
        };
      })
    )
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/googlemaps/addresses"));
});

gulp.task("googlemaps:places:find", function () {
  return gulp
    .src("_json/googlemaps/addresses/*.json")
    .pipe(
      jeditor(function (json) {
        return {
          address: json.address ? json.address : json.location,
        };
      })
    )
    .pipe(googlemapsfindplacefromtext())
    .pipe(googlemapsplacedetails())
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/googlemaps/places"));
});

gulp.task(
  "googlemaps:collect",
  gulp.series([
    "googlemaps:addresses:clean",
    "googlemaps:addresses:collectfrombrokenevents",
  ])
);

gulp.task(
  "googlemaps:find",
  gulp.series(["googlemaps:places:clean", "googlemaps:places:find"])
);
