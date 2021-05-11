"use strict";

const PLUGIN_NAME = "gulp-googlemaps-placedetails";
const PluginError = require("plugin-error");
const log = require("fancy-log");
const through = require("through2");
const vinyl = require("vinyl");
const path = require("path");
const slugify = require("slugify");
const {
  Client,
  PlaceInputType,
} = require("@googlemaps/google-maps-services-js");

module.exports = function (credentials) {
  function push(file, enc, cb) {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return cb(new PluginError(PLUGIN_NAME, "Missing GOOGLE_MAPS_API_KEY."));
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

    const client = new Client({});

    const jsonobj = JSON.parse(file.contents.toString());

    if (!jsonobj) {
      return cb(new PluginError(PLUGIN_NAME, "No or invalid json data."));
    }

    if (!jsonobj.place_id) {
      console.warn("No place_id given as parameter.");
      return cb(null);
    }

    /**
     * fetch a google place with details
     */
    client
      .placeDetails({
        params: {
          place_id: jsonobj.place_id,
          inputtype: PlaceInputType.textQuery,
          fields: ["address_component", "business_status", "geometry", "types"],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: process.env.GOOGLE_MAPS_API_TIMEOUT | 2000, // milliseconds
      })
      .then((response) => {
        // TODO: REMOVE console.log(JSON.stringify(response.data, null, 2));
        if (response?.data?.status === "OK" && response?.data?.result) {
          const googleplace = response.data.result;
          if (googleplace.address_components)
            jsonobj.address_components = googleplace.address_components;
          if (googleplace.business_status)
            jsonobj.business_status = googleplace.business_status;
          if (googleplace.geometry) jsonobj.geometry = googleplace.geometry;
          if (googleplace.types) jsonobj.types = googleplace.types;
        }
        const filename = file.stem + file.extname;
        file.dirname = ".";
        var opts = {
          path: path.resolve(file.dirname, filename),
        };
        var newfile = new vinyl(opts);
        // stream out the event as json file
        newfile.contents = new Buffer.from(JSON.stringify(jsonobj));
        this.push(newfile);
        return cb(null);
      })
      .catch((err) => {
        console.error(
          "Oh no, the google places detail request failed: ",
          err.message
        );
      });
  }
  return through.obj(push);
};
