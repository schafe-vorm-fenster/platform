"use strict";

var gulp = require("gulp"),
  $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "uglify-save-license", "del"],
  });

var jeditor = require("gulp-json-editor");
var del = require("del");
const patchtosanity = require("../plugins/gulp-patch-to-sanity");
const sanityClient = require("@sanity/client");
const slugify = require("slugify");

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

gulp.task("sanity:municipality:delete", function () {
  return client
    .fetch('*[_type == "municipality"]')
    .then((municipalities) => {
      municipalities.forEach((municipality) => {
        client.delete(municipality._id).catch((err) => {
          console.error("Oh no, the update failed: ", err.message);
        });
      });
    })
    .catch((err) => {
      console.error("Oh no, the update failed: ", err.message);
    });
});

gulp.task("sanity:municipality:push", function () {
  return gulp
    .src("_json/geonames/municipalities/*.json")
    .pipe(
      jeditor(function (json) {
        const municipality = {
          _id: "geonames." + json.geonameId,
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

gulp.task("sanity:municipality", gulp.series(["sanity:municipality:push"]));
