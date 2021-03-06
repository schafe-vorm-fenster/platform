"use strict";

const PLUGIN_NAME = "gulp-determine-sanity-event-place-reference";

const PluginError = require("plugin-error");
const log = require("fancy-log");
const through = require("through2");
const vinyl = require("vinyl");
const path = require("path");
const slugify = require("slugify");
const sanityClient = require("@sanity/client");

module.exports = function (credentials) {
  function push(file, enc, cb) {
    if (!credentials) {
      return cb(new PluginError(PLUGIN_NAME, "Missing credentials."));
    }

    if (!credentials.projectId) {
      return cb(new PluginError(PLUGIN_NAME, "Missing projectId."));
    }

    if (!credentials.dataset) {
      return cb(new PluginError(PLUGIN_NAME, "Please provide a dataset name."));
    }

    if (!credentials.token) {
      return cb(new PluginError(PLUGIN_NAME, "Missing access token."));
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

    const client = sanityClient({
      projectId: credentials.projectId,
      dataset: credentials.dataset,
      token: credentials.token,
      useCdn: false,
    });

    const jsonobj = JSON.parse(file.contents.toString());

    if (!jsonobj) {
      return cb(new PluginError(PLUGIN_NAME, "No or invalid json data."));
    }

    // query for places based on the given address/location string
    // if place could be found, set the place reference and the community reference based on the place data
    // if no place could be found, query for communities with the address/location string, to set the community reference

    if (!jsonobj.location) {
      jsonobj.location = "";
      console.log("Info: No jsonobj.location supplied.");
    }
    const query =
      '*[_type == "place" && (address == $address || $address in address_aliases)]';
    const params = { address: jsonobj.location };

    client
      .fetch(query, params)
      .then((places) => {
        if (places && places.length > 0) {
          /**
           * Found a matching place in sanity.
           * So add place and community as reference to the event json.
           */
          var place = places[0];
          jsonobj.community = place.community;
          jsonobj.place = {
            _type: "reference",
            _ref: place._id,
            _weak: true,
          };

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
        } else {
          /**
           * No place found in sanity.
           * Check, if a community in sanity is matching.
           */
          const query =
            '*[_type == "community" && $address in address_aliases]';
          const params = { address: jsonobj.location };

          client
            .fetch(query, params)
            .then((communities) => {
              if (communities && communities.length > 0) {
                /**
                 * Matching community found in sanity.
                 * So add this community as place and community reference.
                 */
                var community = communities[0];
                jsonobj.community = {
                  _type: "reference",
                  _ref: community._id,
                  _weak: true,
                };
                jsonobj.place = {
                  _type: "reference",
                  _ref: community._id,
                  _weak: true,
                };

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
              } else {
                /**
                 * No matching place and no mathcing community found.
                 * If seems to be an unknown location.
                 */
                const filename = file.stem + file.extname;
                const dirname = "missingplace";
                var opts = {
                  path: path.resolve(dirname, filename),
                };
                var newfile = new vinyl(opts);
                // stream out the event as json file
                newfile.contents = new Buffer.from(JSON.stringify(jsonobj));
                this.push(newfile);
                return cb(null);
              }
            })
            .catch((err) => {
              console.error("Oh no, the update failed: ", err.message);
            });
        }
      })
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
      });
  }

  return through.obj(push);
};
