"use strict";

var gulp = require("gulp"),
  $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "uglify-save-license", "del"],
  });

var jeditor = require("gulp-json-editor");
var del = require("del");
var split = require("../plugins/gulp-split-array");
const geonameschildren = require("../plugins/gulp-geonames-children");
const geonamesget = require("../plugins/gulp-geonames-get");
const wikidataimages = require("../plugins/gulp-wikidata-images");
const slugify = require("slugify");
const beautify = require("gulp-jsbeautifier");

const geonames_credentials = {
  username: process.env.GEONAMES_USERNAME
    ? process.env.GEONAMES_USERNAME
    : "schafevormfenster",
  lan: "de",
};

gulp.task("geonames:communities:clean", function () {
  return del("_json/geonames/communities/*");
});

gulp.task("geonames:communities:get", function () {
  return gulp
    .src("_json/geonames/municipalities/*.json")
    .pipe(geonameschildren(geonames_credentials))
    .pipe(split("geonames", "geonameId", "name"))
    .pipe(geonamesget(geonames_credentials))
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/geonames/communities/"));
});

gulp.task("geonames:communities:enrich", function () {
  return gulp
    .src("_json/geonames/communities/*.json")
    .pipe(wikidataimages())
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/geonames/communities/"));
});

gulp.task(
  "geonames:communities",
  gulp.series([
    "geonames:communities:clean",
    "geonames:communities:get",
    "geonames:communities:enrich",
  ])
);
