"use strict";

const PLUGIN_NAME = "gulp-geonames-search";
const PluginError = require("plugin-error");
const log = require("fancy-log");
const through = require("through2");
const vinyl = require("vinyl");
const path = require("path");
const slugify = require("slugify");
const Geonames = require("geonames.js");

module.exports = function (credentials, filters = {}) {
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
      token: 'token'
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

    // build query
    let searchQuery = { q: 'Wasserschloss' };
    if (filters?.adminCode4 === true && jsonobj?.adminCode4)
      searchQuery.adminCode4 = jsonobj.adminCode4;
    // if (filters?.featureCode && filters?.featureCode.length > 0)
    //   searchQuery.featureCode = filters.featureCode;
    // if (filters?.featureClass && filters?.featureClass.length > 0)
    //   searchQuery.featureClass = filters.featureClass;

    console.log(searchQuery);

    /**
     * query for geonames search
     */
    try {
      geonames.search(searchQuery).then((response) => {
        if (response?.status?.value === 19) {
          return cb(new PluginError(PLUGIN_NAME, response?.status?.message));
        }
        let result = null;
        result = response;
        console.log(result);

        if (result?.geonames?.length > 0) {
          for (let i = 0; i < result.geonames.length; i++) {
            result.geonames[i].parent = jsonobj;
          }
        }

        const filename = file.stem + file.extname;
        file.dirname = ".";
        var opts = {
          path: path.resolve(file.dirname, filename),
        };
        var newfile = new vinyl(opts);
        // stream out the event as json file
        newfile.contents = new Buffer.from(JSON.stringify(result));
        this.push(newfile);
        return cb(null);
      });
    } catch (err) {
      console.error(err);
    }
  }
  return through.obj(push);
};
