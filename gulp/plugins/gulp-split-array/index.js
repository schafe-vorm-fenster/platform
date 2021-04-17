'use strict'

const PLUGIN_NAME = 'gulp-split-array'

const PluginError  = require('plugin-error')
const log = require('fancy-log')
const through = require('through2')
const vinyl = require('vinyl')
const path = require('path')
const slugify = require('slugify')

module.exports = function(jsonpath,itemname) {

  function split(file, enc, cb) {

    if (!jsonpath) {
      return cb(new PluginError(PLUGIN_NAME, 'Missing json path to array.'))
    }

    if (file.isNull()) {
      return cb(new PluginError(PLUGIN_NAME, 'Missing stream or file.'))
    }

    if(file.isStream()){
      return cb(new PluginError(PLUGIN_NAME, 'Streaming is not supported. Please use vinyl-buffer.'))
    }
      
    const jsonobj = JSON.parse(file.contents.toString())

    if (!jsonobj) {
      return cb(new PluginError(PLUGIN_NAME, 'No or invalid json data.'))
    }

    const jsonarray = jsonobj[jsonpath]

    if (!Array.isArray(jsonarray)) {
      return cb(new PluginError(PLUGIN_NAME, 'Json at ' + jsonpath + ' does not contain an array.'))
    }

    for (var i = 0; i < jsonarray.length; i++){
      // console.log(i)
      // console.log(jsonarray[i])
      var item = jsonarray[i]
      // defaults filename to input file plus iterator
      var filename = file.stem + '_' + i + file.extname
      // set file name to given id attribute
      const slugBase = (typeof item[itemname] === "string") ? item[itemname] : item[itemname].toString()
      if(itemname) filename = slugify(slugBase, { lower: true }) + file.extname
      var opts = {
        path: path.resolve(file.dirname, filename)
      }

      var newfile = new vinyl(opts)

      // stream out the event as json file
      newfile.contents = new Buffer.from(JSON.stringify(item))
      this.push(newfile)


    }
    return cb(null)
  }

  return through.obj(split)
}