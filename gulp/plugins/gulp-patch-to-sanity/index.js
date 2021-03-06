"use strict";

const PLUGIN_NAME = "gulp-patch-to-sanity";

const PluginError = require("plugin-error");
const log = require("fancy-log");
const through = require("through2");
const vinyl = require("vinyl");
const path = require("path");
const slugify = require("slugify");
const sanityClient = require("@sanity/client");

module.exports = function (credentials, mode = "patch") {
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

    const jsonobj = JSON.parse(file.contents.toString());

    if (!jsonobj) {
      return cb(new PluginError(PLUGIN_NAME, "No or invalid json data."));
    }

    // console.log(jsonobj)

    const client = sanityClient({
      projectId: credentials.projectId,
      dataset: credentials.dataset,
      token: credentials.token,
      useCdn: false,
    });

    setTimeout(() => {  console.log("..."); }, 500);

    client
      .createIfNotExists(jsonobj)
      .then((res) => {
        console.log(
          `Document with id ${res._id} created (or was already present)`
        );
      })
      .catch((err) => {
        if (err.message.includes("HTTP 429")) {
          console.error("Sanity API Rate Limits exceeded: ", err.message);
        } else {
          console.error(`Document ${jsonobj._id} already exists`, err.message);
        }
      });
    if (mode === "overwrite") {
      client
        .patch(jsonobj._id) // Document ID to patch
        .set(jsonobj) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((res) => {
          console.log(`Document with id ${res._id} updated`);
        })
        .catch((updateError) => {
          console.error("Oh no, the update failed: ", updateError.message);
        });
    } else {
      client
        .patch(jsonobj._id) // Document ID to patch
        .setIfMissing(jsonobj) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((res) => {
          console.log(`Document with id ${res._id} updated`);
        })
        .catch((updateError) => {
          console.error("Oh no, the update failed: ", updateError.message);
        });
    }

    const filename = file.stem + file.extname;
    var opts = {
      path: path.resolve(file.dirname, filename),
    };
    var newfile = new vinyl(opts);

    // stream out the event as json file
    newfile.contents = new Buffer.from(JSON.stringify(jsonobj));
    this.push(newfile);

    return cb(null);
  }

  return through.obj(push);
};
