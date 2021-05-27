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

gulp.task("sanity:place:clean", function () {
  return del("_json/sanity/place/*");
});

gulp.task("sanity:place:delete", function () {
  return client
    .fetch('*[_type == "place"]')
    .then((places) => {
      places.forEach((place) => {
        client.delete(place._id).catch((err) => {
          console.error("Oh no, the update failed: ", err.message);
        });
      });
    })
    .catch((err) => {
      console.error("Oh no, the update failed: ", err.message);
    });
});

gulp.task("sanity:place:get", function () {
  return request({
    method: "GET",
    uri: uri,
    auth: {
      bearer: token,
    },
  })
    .pipe(source("sanity_place.json"))
    .pipe(buffer())
    .pipe(split("result", "name"))
/*    .pipe(
      combine("places.json", function (data, meta) {
        return new Buffer.from(JSON.stringify(data));
      })
    )*/
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("_json/sanity/place/"));
});

gulp.task("sanity:place:addrefs", function () {
  return gulp
    .src("_json/googlemaps/places/*.json")
    .pipe(determinesanitycommunityreference(sanity_credentials))
    .pipe(beautify({ indent_size: 2 }))
    .pipe(gulp.dest("./"));
});

gulp.task("sanity:place:push", function () {
  return gulp
    .src("_json/googlemaps/places/*.json")
    .pipe(
      jeditor(function (json) {
        const shortNameArr = json?.alternateNames.filter(
          (item) => item.isShortName === true
        );
        json.shortname =
          shortNameArr?.length > 0 && shortNameArr[0].name
            ? shortNameArr[0].name
            : json.name;
        let _id = null;
        if (!_id && json.geonameId) _id = "geoname." + json.geonameId;
        if (!_id && json.place_id) _id = "googleplace." + json.place_id;
        if (!_id && json.address) _id = "address." + slugify(json.address);
        return {
          _id: _id,
          _type: "place",
          name: json.toponymName ? json.toponymName : json.name,
          localname: json.shortname ? json.shortname : json.name,
          community: json.sanity_community_ref,
          place_id: json.place_id,
          wikidata_id: json?.wikidataId ? json.wikidataId : "",
          address: json.formatted_address,
          address_aliases: [
            json.toponymName + ", " + json.formatted_address,
            json.toponymName + ", " + json.adminName4,
            json.toponymName + ", " + json.adminName4 + ", " + json.countryName,
            json.toponymName +
              ", " +
              json?.parent?.postalCode +
              " " +
              json.adminName4,
            json.toponymName +
              ", " +
              json?.parent?.postalCode +
              " " +
              json.adminName4 +
              ", " +
              json.countryName,
          ],
          geolocation: {
            _type: "geopoint",
            lat: json.geometry.location.lat,
            lng: json.geometry.location.lng,
          },
          description: json.types.join(", "),
          wikimedia_commons_imagelinks: json.wikimediaCommonsImages
            ? json.wikimediaCommonsImages.map(function (item) {
                return item.src;
              })
            : [],
        };
      })
    )
    .pipe(patchtosanity(sanity_credentials, "overwrite"));
});

gulp.task(
  "sanity:place",
  gulp.series(["sanity:place:clean", gulp.parallel(["sanity:place:get"])])
);

gulp.task(
  "sanity:addplaces",
  gulp.series(["sanity:place:addrefs", gulp.parallel(["sanity:place:push"])])
);
