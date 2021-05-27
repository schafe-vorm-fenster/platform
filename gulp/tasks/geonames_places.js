"use strict";

var gulp = require("gulp"),
  $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "uglify-save-license", "del"],
  });

var jeditor = require("gulp-json-editor");
var del = require("del");
var split = require("../plugins/gulp-split-array");
const geonamessearch = require("../plugins/gulp-geonames-search");
const geonamesget = require("../plugins/gulp-geonames-get");
const wikidataimages = require("../plugins/gulp-wikidata-images");
const googlemapsfindplacefromtext = require("../plugins/gulp-googlemaps-findplacefromtext");
const googlemapsplacedetails = require("../plugins/gulp-googlemaps-placedetails");
const slugify = require("slugify");
const beautify = require("gulp-jsbeautifier");

const geonames_credentials = {
  username: process.env.GEONAMES_USERNAME
    ? process.env.GEONAMES_USERNAME
    : "schafevormfenster",
  lan: "de",
};

gulp.task("geonames:places:clean", function () {
  return del("_json/geonames/places/*");
});

gulp.task("geonames:places:get", function () {
  return gulp
    .src("_json/geonames/municipalities/*.json")
    .pipe(
      geonamessearch(geonames_credentials, {
        adminCode4: true,
        featureClass: ["L", "S"],
      })
    )
    .pipe(split("geonames", "geonameId", "name"))
    .pipe(geonamesget(geonames_credentials))
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/geonames/places/"));
});

gulp.task("geonames:places:enrichbywikidata", function () {
  return gulp
    .src("_json/geonames/places/*.json")
    .pipe(wikidataimages())
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/geonames/places/"));
});

gulp.task("geonames:places:enrichbygoogleplaces", function () {
  return gulp
    .src("_json/geonames/places/*.json")
    .pipe(
      jeditor(function (json) {
        // set "address" as search query input for google places
        const address = [
          json?.toponymName ? json.toponymName : undefined,
          json?.parent?.postalCode && json?.parent?.name
            ? json.parent.postalCode + " " + json.parent.name
            : undefined,
          json?.parent?.countryName ? json.parent.countryName : undefined,
        ].join(", ");
        json.address = address;
        return json;
      })
    )
    .pipe(googlemapsfindplacefromtext())
    .pipe(googlemapsplacedetails())
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/googlemaps/places/"));
});

gulp.task(
  "geonames:places",
  gulp.series([
    "geonames:places:get",
    "geonames:places:enrichbywikidata",
    "geonames:places:enrichbygoogleplaces"
  ])
);
