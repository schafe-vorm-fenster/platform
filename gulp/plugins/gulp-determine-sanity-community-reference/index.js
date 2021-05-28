"use strict";

const PLUGIN_NAME = "gulp-determine-sanity-community-reference";

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

    if (!jsonobj.address_components) {
      jsonobj.address_components = [];
      console.log("Info: No jsonobj.address_components supplied.");
    }

    if (!jsonobj.parent) {
      jsonobj.parent = {};
      console.log("Info: No jsonobj.parent supplied.");
    }

    let communityName = null;
    let municipalityName = null;
    if (jsonobj.address_components && jsonobj.address_components.length > 0) {
      for (let index = 0; index < jsonobj.address_components.length; index++) {
        const comp = jsonobj.address_components[index];
        if (comp.types.includes("sublocality")) communityName = comp.long_name;
        if (comp.types.includes("locality")) municipalityName = comp.long_name;
      }
      if (!communityName) communityName = municipalityName;
    }

    const query =
      '*[_type == "community" && (name == $communityName || $communityName in address_aliases)]{ _id, name, municipality->{_id,name}}';
    const params = {
      communityName: communityName,
      municipalityName: municipalityName,
    };

    client
      .fetch(query, params)
      .then((communities) => {
        if (communities && communities.length > 0) {
          const matchingCommunity = communities.map((item) => {
            if (
              item.name === communityName &&
              item.municipality.name === municipalityName
            )
            return item;
          })[0];
          if (matchingCommunity && matchingCommunity._id)
            console.debug(
              "Found community " +
                matchingCommunity._id +
                ", " +
                matchingCommunity.name +
                " for " +
                communityName +
                " (" +
                municipalityName +
                ") at sanity"
            );
          jsonobj.sanity_community_ref = {
            _type: "reference",
            _ref: matchingCommunity._id,
            _weak: true,
          };
          const filename = file.stem + file.extname;
          var opts = {
            path: path.resolve(file.dirname, filename),
          };
          var newfile = new vinyl(opts);
          // stream out the event as json file
          newfile.contents = new Buffer.from(JSON.stringify(jsonobj));
          this.push(newfile);
          return cb(null);
        } else {
          console.info(
            "No community found at sanity for " +
              communityName +
              " (" +
              municipalityName +
              ")"
          );
          return cb(null);
        }
      })
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
      });
  }

  return through.obj(push);
};
