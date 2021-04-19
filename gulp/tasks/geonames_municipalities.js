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
const geonamespostalcode = require("../plugins/gulp-geonames-postalcode");
const beautify = require("gulp-jsbeautifier");

const geonames_credentials = {
  username: process.env.GEONAMES_USERNAME
    ? process.env.GEONAMES_USERNAME
    : "schafevormfenster",
  lan: "de",
};

gulp.task("geonames:municipalities:clean", function () {
  return del("_json/geonames/municipalities/*");
});

gulp.task("geonames:municipalities:get", function () {
  return gulp
    .src("data/municipalities/*.json")
    .pipe(geonameschildren(geonames_credentials))
    .pipe(split("geonames", "geonameId", "name"))
    .pipe(geonamesget(geonames_credentials))
    .pipe(geonamespostalcode(geonames_credentials))
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/geonames/municipalities/"));
});

gulp.task(
  "geonames:municipalities",
  gulp.series([
    "geonames:municipalities:clean",
    gulp.parallel(["geonames:municipalities:get"]),
  ])
);
