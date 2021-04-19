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
const sanityClient = require("@sanity/client");
const slugify = require("slugify");

const projectId = "gzgufr8h";
const dataset = "production";
const token =
  "skVOB0wWEG7zqtFqLtMWV0VGnqZCzDoPbUuwVtilpmdxPSJtCCNg8wNJmGSwNYubFi00wCyAocAntwufWuwsQrQPk2GMDvsFNgAEPTz3jIABdbNqK4kr1LimIxB5LXxjPtYuQ3vlvLzG2Yj8kiRXbesq3lR4D0kzK0hD1M00Yx5IpO05IqjQ";
const query = '*[_type=="community"]';
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

gulp.task("sanity:community:clean", function () {
  return del("_json/sanity/community/*");
});

gulp.task("sanity:community:delete", function () {
  return client
    .fetch('*[_type == "community"]')
    .then((communities) => {
      communities.forEach((comminity) => {
        client.delete(comminity._id).catch((err) => {
          console.error("Oh no, the update failed: ", err.message);
        });
      });
    })
    .catch((err) => {
      console.error("Oh no, the update failed: ", err.message);
    });
});

gulp.task("sanity:community:get", function () {
  return request({
    method: "GET",
    uri: uri,
    auth: {
      bearer: token,
    },
  })
    .pipe(source("sanity_community.json"))
    .pipe(buffer())
    .pipe(split("result", "name"))
    .pipe(
      jeditor(function (json) {
        json.slug = json.slug.current;
        return json;
      })
    )
    .pipe(
      combine("communities.json", function (data, meta) {
        // console.log('---');
        // console.log(data);
        // console.log('---');
        // console.log(meta);
        return new Buffer.from(JSON.stringify(data));
      })
    )
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/sanity/community/"));
});

gulp.task("sanity:community:push", function () {
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
    .pipe(patchtosanity(sanity_credentials, "patch"));
});

gulp.task(
  "sanity:community",
  gulp.series([
    "sanity:community:clean",
    gulp.parallel(["sanity:community:get"]),
  ])
);
