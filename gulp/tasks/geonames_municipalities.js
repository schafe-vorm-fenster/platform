"use strict";

var gulp = require("gulp"),
  $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "uglify-save-license", "del"],
  });

var jeditor = require("gulp-json-editor");
var del = require("del");
var split = require("../plugins/gulp-split-array");
const patchtosanity = require("../plugins/gulp-patch-to-sanity");
const geonameschildren = require("../plugins/gulp-geonames-children");
const geonamesget = require("../plugins/gulp-geonames-get");
const geonamespostalcode = require("../plugins/gulp-geonames-postalcode");
const sanityClient = require("@sanity/client");
const slugify = require("slugify");
const beautify = require("gulp-jsbeautifier");

const geonames_credentials = {
  username: process.env.GEONAMES_USERNAME
    ? process.env.GEONAMES_USERNAME
    : "schafevormfenster",
  lan: "de",
};

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

gulp.task("geonames:municipalities:push", function () {
  return gulp
    .src("_json/geonames/municipalities/*.json")
    .pipe(
      jeditor(function (json) {
        const municipality = {
          _id: "geoname." + json.geonameId,
          _type: "municipality",
          name: json.name,
          slug: {
            _type: "slug",
            current: json.asciiName
              ? slugify(json.asciiName, { lower: true })
              : slugify(json.name, { lower: true }),
          },
        };
        return municipality;
      })
    )
    .pipe(patchtosanity(sanity_credentials));
});

gulp.task(
  "geonames:municipalities",
  gulp.series([
    "geonames:municipalities:clean",
    gulp.parallel(["geonames:municipalities:push"]),
  ])
);
