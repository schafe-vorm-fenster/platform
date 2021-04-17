"use strict";

var gulp = require("gulp"),
  $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "uglify-save-license", "del"],
  });

var jeditor = require("gulp-json-editor");
var del = require("del");
var split = require("../plugins/gulp-split-array");
const patchtosanity = require("../plugins/gulp-patch-to-sanity");
const sanityClient = require("@sanity/client");
const slugify = require("slugify");

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

gulp.task("geonames:municipalities:push", function () {
  return gulp
    .src("data/geonames/ADM3-8648415.json")
    .pipe(
      jeditor(function (json) {
        const municipalities = json.region.municipalities.geonames;
        return { municipalities: municipalities };
      })
    )
    .pipe(split("municipalities", "geonameId"))
    .pipe(
      jeditor(function (json) {
        const municipality = {
          _id: "geoname." + json.geonameId,
          _type: "municipality",
          name: json.name,
          slug: {
            _type: "slug",
            current: slugify(json.name, { lower: true }),
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
