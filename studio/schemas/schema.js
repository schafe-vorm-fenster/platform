import React from 'react'
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import { FiCalendar, FiMapPin, FiCrosshair, FiWatch, FiUser, FiMap } from 'react-icons/fi'



// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([

    {
      title: "Municipality",
      name: "municipality",
      type: "document",
      icon: FiMap,
      fields: [
        {
          title: "Name",
          name: "name",
          type: "string",
          required: true
        },
        {
          title: "URL",
          name: "slug",
          type: "slug",
          options: {
            source: 'name',
            slugify: input => input
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/ä/g, 'ae')
              .replace(/ö/g, 'oe')
              .replace(/ü/g, 'ue')
              .replace(/ß/g, 'ss')
              .slice(0, 200)
          },
          required: true
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        },
        {
          title: "Google Place ID",
          name: "place_id",
          type: "string",
        },
      ],
      preview: {
        select: {
          title: 'name',
          description: 'description'
        }
      }
    },

    {
      title: "Village",
      name: "community",
      type: "document",
      icon: FiMapPin,
      fields: [
        {
          title: "Name",
          name: "name",
          type: "string",
        },
        {
          title: "URL",
          name: "slug",
          type: "slug",
          options: {
            source: 'name',
            slugify: input => input
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/ä/g, 'ae')
              .replace(/ö/g, 'oe')
              .replace(/ü/g, 'ue')
              .replace(/ß/g, 'ss')
              .slice(0, 200)
          }
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        },
        {
          title: "Google Place ID",
          name: "place_id",
          type: "string",
        },
        {
          title: "Visual",
          name: "image",
          type: "image",
          options: {
            hotspot: true
          }
        },
        {
          title: 'Municipality',
          name: 'municipality',
          type: 'reference',
          weak: true,
          to: [{type: 'municipality'}],
          description: 'To which municipality does that village belong to?'
        }
      ],
      preview: {
        select: {
          title: 'name',
          municipality: 'municipality.name',
          media: 'image.asset.url',
          description: 'description'
        },
        prepare(selection) {
          const {title, municipality, media, description} = selection
          const thumb = media + '?h=80&w=80&fit=crop'
          return {
            title: title,
            subtitle: `in der ${municipality ? municipality : 'unknown'}`,
            media: <img src={thumb} />,
            description: description
          }
        }
      }
    },

    {
      title: "Place",
      name: "place",
      type: "document",
      icon: FiCrosshair,
      fields: [
        {
          title: "Name",
          name: "name",
          type: "string",
        },
        {
          title: "Google Place ID",
          name: "place_id",
          type: "string",
        },
        {
          title: "Address",
          name: "address",
          type: "string",
        },
        {
          title: "Geolocation",
          name: "geolocation",
          type: "geopoint",
        },
        {
          title: 'Village',
          name: 'community',
          type: 'reference',
          weak: true,
          to: [{type: 'community'}],
          description: 'To which village does that place belong to?'
        },
        {
          title: "Visual",
          name: "image",
          type: "image",
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        }
      ],
      preview: {
        select: {
          title: 'name',
          community: 'community.name',
          description: 'description',
          media: 'image.asset.url',
        },
        prepare(selection) {
          const {title, community, description, media} = selection
          const thumb = media + '?h=80&w=80&fit=crop'
          return {
            title: title,
            subtitle: `in ${community ? community : 'unknown'}`,
            media: <img src={thumb} />,
            description: description
          }
        }
      }
    },

    {
      title: "Organizer",
      name: "organizer",
      type: "document",
      icon: FiUser,
      fields: [
        {
          title: "Name",
          name: "name",
          type: "string",
        },
        {
          title: "Full name",
          name: "longname",
          type: "string",
        },
        {
          title: "URL",
          name: "slug",
          type: "slug",
          options: {
            source: 'name',
            slugify: input => input
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/ä/g, 'ae')
              .replace(/ö/g, 'oe')
              .replace(/ü/g, 'ue')
              .replace(/ß/g, 'ss')
              .slice(0, 200)
          }
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        },
        {
          title: "Google Place ID",
          name: "place_id",
          type: "string",
        },
        {
          title: "Website",
          name: "website",
          type: "url",
        },
        {
          title: 'Calendars',
          name: 'calendars',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'calendar'}]
            }
          ]
        }
      ],
      preview: {
        select: {
          title: 'name',
          subtitle: 'longname' // if the movie has a director, follow the relation and get the name
        }
      }
    },

    {
      title: "Calendar",
      name: "calendar",
      type: "document",
      icon: FiCalendar,
      fields: [
        {
          title: "Name",
          name: "name",
          type: "string",
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        },
        {
          title: "Google Calendar ID",
          name: "calendar_id",
          type: "string",
        }
      ],
      preview: {
        select: {
          title: 'name',
          subtitle: 'calendar_id'
        }
      }
    },

    {
      title: "Event",
      name: "event",
      type: "document",
      icon: FiWatch,
      fields: [
        {
          title: "Summary",
          name: "name",
          type: "string",
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        },
        {
          title: "Start",
          name: "start",
          type: "datetime",
          options: {
            dateFormat: 'DD.MM.YYYY',
            timeFormat: 'HH:mm',
            timeStep: 15,
            calendarTodayLabel: 'Today'
          }
        },
        {
          title: "Allday?",
          name: "allday",
          type: "boolean",
        },
        {
          title: "End",
          name: "end",
          type: "datetime",
          options: {
            dateFormat: 'DD.MM.YYYY',
            timeFormat: 'HH:mm',
            timeStep: 15,
            calendarTodayLabel: 'Today'
          }
        },
        {
          title: "Location",
          name: "location",
          type: "string",
        },
        {
          title: "Attachment",
          name: "attachment",
          type: "file",
        },
        {
          title: 'Place',
          name: 'place',
          type: 'reference',
          weak: true,
          to: [{type: 'place'}],
          description: 'At which place does the event happen?'
        },
        {
          title: 'Village',
          name: 'community',
          type: 'reference',
          weak: true,
          to: [{type: 'community'}],
          description: 'To which village does that place belong to?'
        },
        {
          title: 'Organizer',
          name: 'organizer',
          type: 'reference',
          weak: true,
          to: [{type: 'organizer'}],
          description: 'Which organizer is responsible?'
        },
        {
          title: "Google Event ID",
          name: "event_id",
          type: "string",
        }
      ],
      preview: {
        select: {
          title: 'name',
          start: 'start',
          community: 'community.name'
        },
        prepare(selection) {
          const {title, start, community} = selection
          return {
            title: title,
            subtitle: `in ${community ? community : 'unknown'} at ${start ? start : 'unknown'}`
          }
      }
      }
    }

  ])
})
