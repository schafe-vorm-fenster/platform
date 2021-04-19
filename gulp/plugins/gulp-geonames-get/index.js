"use strict";

const PLUGIN_NAME = "gulp-geonames-get";
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
     * query for geonames children in two levels
     */
    try {
      geonames
        .get({
          geonameId: jsonobj.geonameId,
        })
        .then((response) => {
          const filename = file.stem + file.extname;
          console.log(file.dirname);
          file.dirname = ".";
          var opts = {
            path: path.resolve(file.dirname, filename),
          };
          var newfile = new vinyl(opts);
          // stream out the event as json file
          newfile.contents = new Buffer.from(JSON.stringify(response));
          this.push(newfile);
          return cb(null);
        });
    } catch (err) {
      console.error(err);
    }
  }
  return through.obj(push);
};
