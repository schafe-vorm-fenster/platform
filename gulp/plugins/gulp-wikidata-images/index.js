"use strict";

const PLUGIN_NAME = "gulp-wikidata-images";
const PluginError = require("plugin-error");
const log = require("fancy-log");
const through = require("through2");
const vinyl = require("vinyl");
const path = require("path");
const slugify = require("slugify");
const WBK = require("wikibase-sdk");
const fetch = require("node-fetch");
const commons = require("commons-photo-url");

module.exports = function (credentials) {
  function push(file, enc, cb) {
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

    /**
     * query for geonames children in two levels
     */
    if (jsonobj.wikidataId) {
      const wbk = WBK({
        instance: "https://www.wikidata.org",
        sparqlEndpoint: "https://query.wikidata.org/sparql",
      });

      const url = wbk.getEntities({
        ids: [jsonobj.wikidataId],
        languages: ["de"], // returns all languages if not specified
        redirections: false, // defaults to true
      });

      console.log(jsonobj.geonameId + " / " + jsonobj.name);
      if (jsonobj.geonameId === 2892628) console.log(jsonobj);

      try {
        fetch(url)
          .then((res) => res.json())
          .then((json) => {
            const p18items = json?.entities[jsonobj.wikidataId]?.claims?.P18;
            if (p18items?.length > 0) {
              jsonobj.wikimediaCommonsImages = p18items.map((image) => {
                const imageName = image.mainsnak?.datavalue?.value.replace(
                  / /g,
                  "_"
                );
                if (imageName)
                  return {
                    link:
                      "https://commons.wikimedia.org/wiki/File:" + imageName,
                    src: commons(imageName, commons.sizes.medium),
                  };
              });
            }
            // create stream
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
          });
      } catch (err) {
        console.error(err);
      }
    } else {
      // create stream
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
    }
  }
  return through.obj(push);
};
