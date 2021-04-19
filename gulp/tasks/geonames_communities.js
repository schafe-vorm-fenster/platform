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
const wikidataimages = require("../plugins/gulp-wikidata-images");
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

gulp.task("geonames:communities:clean", function () {
  return del("_json/geonames/communities/*");
});

gulp.task("geonames:communities:get", function () {
  return gulp
    .src("_json/geonames/municipalities/*.json")
    .pipe(geonameschildren(geonames_credentials))
    .pipe(split("geonames", "geonameId", "name"))
    .pipe(geonamesget(geonames_credentials))
    .pipe(wikidataimages())
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/geonames/communities/"));
});

gulp.task("geonames:communities:push", function () {
  return gulp
    .src("_json/geonames/communities/*.json")
    .pipe(
      jeditor(function (json) {
        let community = {
          _id: "geonames." + json.geonameId,
          _type: "community",
          name: json.name,
          slug: {
            _type: "slug",
            current: json.asciiName
              ? slugify(json.asciiName, { lower: true })
              : slugify(json.name, { lower: true }),
          },
          municipality: {
            _type: "reference",
            _ref: "geonames." + json.adminId4,
            _weak: true,
          },
          address_aliases: [
            json.name + ", " + json.adminName4,
            json.name + ", " + json.adminName4 + ", " + json.countryName,
            json.name + ", " + json?.parent?.postalCode + " " + json.adminName4,
            json.name +
              ", " +
              json?.parent?.postalCode +
              " " +
              json.adminName4 +
              ", " +
              json.countryName,
          ],

          wikimedia_commons_imagelinks: json.wikimediaCommonsImages
            ? json.wikimediaCommonsImages.map(function (item) {
                return item.src;
              })
            : [],

          wikidata_id: json?.wikidataId ? json.wikidataId : "",
          publication_status: "3",
        };
        return community;
      })
    )
    .pipe(patchtosanity(sanity_credentials, "overwrite"));
});

gulp.task(
  "geonames:communities",
  gulp.series([
    "geonames:communities:clean",
    gulp.parallel(["geonames:communities:push"]),
  ])
);
