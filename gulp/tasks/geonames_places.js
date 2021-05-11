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

/**
 enrich by google plaes
 https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJdZryieSlq0cRfoVRqr9r1PM&key=AIzaSyANUXYWBJQzd3gIPhac1Ebf7MwzO_uHQok


{
   "html_attributions" : [],
   "result" : {
      "address_components" : [
         {
            "long_name" : "57",
            "short_name" : "57",
            "types" : [ "street_number" ]
         },
         {
            "long_name" : "Schlatkow",
            "short_name" : "Schlatkow",
            "types" : [ "route" ]
         },
         {
            "long_name" : "Schlatkow",
            "short_name" : "Schlatkow",
            "types" : [ "sublocality_level_1", "sublocality", "political" ]
         },
         {
            "long_name" : "Schmatzin",
            "short_name" : "Schmatzin",
            "types" : [ "locality", "political" ]
         },
         {
            "long_name" : "Landkreis Vorpommern-Greifswald",
            "short_name" : "Landkreis Vorpommern-Greifswald",
            "types" : [ "administrative_area_level_3", "political" ]
         },
         {
            "long_name" : "Mecklenburg-Vorpommern",
            "short_name" : "MV",
            "types" : [ "administrative_area_level_1", "political" ]
         },
         {
            "long_name" : "Deutschland",
            "short_name" : "DE",
            "types" : [ "country", "political" ]
         },
         {
            "long_name" : "17390",
            "short_name" : "17390",
            "types" : [ "postal_code" ]
         }
      ],
      "adr_address" : "\u003cspan class=\"street-address\"\u003eSchlatkow 57\u003c/span\u003e, \u003cspan class=\"postal-code\"\u003e17390\u003c/span\u003e \u003cspan class=\"locality\"\u003eSchmatzin\u003c/span\u003e, \u003cspan class=\"country-name\"\u003eDeutschland\u003c/span\u003e",
      "business_status" : "CLOSED_TEMPORARILY",
      "formatted_address" : "Schlatkow 57, 17390 Schmatzin, Deutschland",
      "formatted_phone_number" : "039724 23402",
      "geometry" : {
         "location" : {
            "lat" : 53.92066140000001,
            "lng" : 13.580786
         },
         "viewport" : {
            "northeast" : {
               "lat" : 53.9219979802915,
               "lng" : 13.5823899302915
            },
            "southwest" : {
               "lat" : 53.9193000197085,
               "lng" : 13.5796919697085
            }
         }
      },
      "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/civic_building-71.png",
      "international_phone_number" : "+49 39724 23402",
      "name" : "Melkerschule Schlatkow",
      "permanently_closed" : true,
      "photos" : [
         {
            "height" : 1125,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/106252273878918286801\"\u003eKulturverein Schlatkow Schmatzin Wolfradshof\u003c/a\u003e"
            ],
            "photo_reference" : "ATtYBwJflAw5tD2IJAbw1zGmJw_ct8EoNQhDyV2DsxrornTkApj6LbYgPWEdDFePXVd0Tg2-1ZVZMPyxkoO9iuajzYh7ybuo7wJcGCnwEgZ2DG1LUlZmr_3Tnj3_F52qLdaKDNzbA8uBsSZ6H8qkso_UeAhF4C-vfp3TTqLvA6Jqt8msRXwK",
            "width" : 2000
         },
         {
            "height" : 3000,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/106252273878918286801\"\u003eKulturverein Schlatkow Schmatzin Wolfradshof\u003c/a\u003e"
            ],
            "photo_reference" : "ATtYBwLB131hpWmB9Ij38ISYHCGS4sHbtLZUIw9czi0YsoRmDoJ1U8-6KN1CIz_uRAuRxwSHeyTriMelzADhjSa_gxyZhWqtnpUY-tiUC9Z5vR3HB9HjRum--Bn-tffLQwowJ4PbNBeJ3EEcQ1Nvq8Rh3MN0S4zIDqCwKcKBAATALucw8xJn",
            "width" : 5332
         }
      ],
      "place_id" : "ChIJdZryieSlq0cRfoVRqr9r1PM",
      "plus_code" : {
         "compound_code" : "WHCJ+78 Schmatzin, Deutschland",
         "global_code" : "9F5MWHCJ+78"
      },
      "reference" : "ChIJdZryieSlq0cRfoVRqr9r1PM",
      "types" : [ "library", "point_of_interest", "establishment" ],
      "url" : "https://maps.google.com/?cid=17569786517219542398",
      "utc_offset" : 120,
      "vicinity" : "Schlatkow 57, Schmatzin",
      "website" : "http://www.schlatkow.de/"
   },
   "status" : "OK"
}

 */

gulp.task(
  "geonames:places",
  gulp.series([
    "geonames:places:clean",
    "geonames:places:get",
    "geonames:places:enrichbywikidata",
  ])
);
