"use strict";

const PLUGIN_NAME = "gulp-geonames-postalcode";
const PluginError = require("plugin-error");
const log = require("fancy-log");
const through = require("through2");
const vinyl = require("vinyl");
const path = require("path");
const slugify = require("slugify");
const Geonames = require("geonames.js");

module.exports = function (credentials) {
  function push(file, enc, cb) {
    if (!credentials) {
      return cb(new PluginError(PLUGIN_NAME, "Missing credentials."));
    }

    if (!credentials.username) {
      return cb(new PluginError(PLUGIN_NAME, "Missing username."));
    }

    if (file.isNull()) {
      return cb(new PluginError(PLUGIN_NAME, "Missing stream or file."));
    }

    if (file.isStream()) {
      return cb(
        new PluginError(
          PLUGIN_NAME,
          "Streaming is not supported. Please use vinyl-buffer."
        )
      );
    }

    const geonames = Geonames({
      username: credentials.username,
      lan: credentials.lan ? credentials.lan : "de",
      encoding: "JSON",
    });

    const jsonobj = JSON.parse(file.contents.toString());

    if (!jsonobj) {
      return cb(new PluginError(PLUGIN_NAME, "No or invalid json data."));
    }

    if (!jsonobj.geonameId) {
      return cb(
        new PluginError(PLUGIN_NAME, "No geonameId as parent provided.")
      );
    }

    /**
     * search for the postal code of a location and add it to the data
     */
    try {
      geonames
        .postalCodeSearch({
          country: jsonobj.countryCode,
          adminCode1: jsonobj.adminCodes1.ISO3166_2,
          placename: jsonobj.name,
        })
        .then((response) => {
          if (!jsonobj.postalCode || jsonobj?.postalCode === "") {
            // only search for postalCode, it is not already set
            let postalCode = "";
            if (response?.postalCodes?.length === 1) {
              postalCode = response.postalCodes[0]?.postalCode
                ? response.postalCodes[0]?.postalCode
                : "";
            }
            if (response?.postalCodes?.length > 1) {
              const postalCodes = response.postalCodes.filter(
                (postalCodeItem) => {
                  if (
                    postalCodeItem.adminCode3 === jsonobj.adminCode3 &&
                    postalCodeItem.placeName === jsonobj.name
                  )
                    return postalCodeItem;
                }
              );
              postalCode = postalCodes[0]?.postalCode
                ? postalCodes[0]?.postalCode
                : "";
            }
            jsonobj.postalCode = postalCode;
          }
          file.dirname = ".";
          const filename = file.stem + file.extname;
          var opts = {
            path: path.resolve(file.dirname, filename),
          };
          var newfile = new vinyl(opts);
          // stream out the event as json file
          newfile.contents = new Buffer.from(JSON.stringify(jsonobj));
          this.push(newfile);
          return cb(null);
        });
    } catch (err) {
      console.error(err);
    }
  }
  return through.obj(push);
};
