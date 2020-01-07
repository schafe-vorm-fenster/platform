'use strict'

const PLUGIN_NAME = 'gulp-determine-sanity-event-calendar-reference'

const PluginError  = require('plugin-error')
const log = require('fancy-log')
const through = require('through2')
const vinyl = require('vinyl')
const path = require('path')
const slugify = require('slugify')
const sanityClient = require('@sanity/client')


module.exports = function(credentials) {

  function push(file, enc, cb) {

    if (!credentials) {
      return cb(new PluginError(PLUGIN_NAME, 'Missing credentials.'))
    }

    if (!credentials.projectId) {
      return cb(new PluginError(PLUGIN_NAME, 'Missing projectId.'))
    }

    if (!credentials.dataset) {
      return cb(new PluginError(PLUGIN_NAME, 'Please provide a dataset name.'))
    }

    if (!credentials.token) {
      return cb(new PluginError(PLUGIN_NAME, 'Missing access token.'))
    }

    if (file.isNull()) {
      return cb(new PluginError(PLUGIN_NAME, 'Missing stream or file.'))
    }

    if(file.isStream()){
      return cb(new PluginError(PLUGIN_NAME, 'Streaming is not supported. Please use vinyl-buffer.'))
    }

    const client = sanityClient({
      projectId: credentials.projectId,
      dataset: credentials.dataset,
      token: credentials.token,
      useCdn: false
    })

    const jsonobj = JSON.parse(file.contents.toString())

    if (!jsonobj) {
      return cb(new PluginError(PLUGIN_NAME, 'No or invalid json data.'))
    }

    // query for places based on the given address/location string
    // if place could be found, set the place reference and the community reference based on the place data
    // if no place could be found, query for communities with the address/location string, to set the community reference

    if(!jsonobj.calendar_id) {
      jsonobj.calendar_id = ''
      console.log('Info: No jsonobj.calendar_id supplied.')
    }
    const query = '*[_type == "calendar" && calendar_id == $calendar_id]'
    const params = {calendar_id: jsonobj.calendar_id}

    client.fetch(query, params).then( calendars => {

      if(calendars && calendars.length > 0) {
        var calendar = calendars[0]
        jsonobj.calendar = {
          "_type": "reference",
          "_ref": calendar._id,
          "_weak": true
        }
      }else{
        jsonobj.calendar = null
      }

      delete(jsonobj.calendar_id)

      const filename = file.stem + file.extname
      var opts = {
        path: path.resolve(file.dirname, filename)
      }
      var newfile = new vinyl(opts)
      // stream out the event as json file
      newfile.contents = new Buffer.from(JSON.stringify(jsonobj))
      this.push(newfile)
      return cb(null)

    })
    .catch(err => {
      console.error('Oh no, the update failed: ', err.message)
    })

  }


  return through.obj(push)
}