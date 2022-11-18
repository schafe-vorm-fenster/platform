import React from 'react';
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';

import { FiCalendar, FiMapPin, FiCrosshair, FiWatch, FiUser, FiMap } from 'react-icons/fi';

import googleeventattachment from './googleeventattachment';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    googleeventattachment,
    {
      title: 'Municipality',
      name: 'municipality',
      type: 'document',
      icon: FiMap,
      fields: [
        {
          title: 'Name',
          name: 'name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'URL',
          name: 'slug',
          type: 'slug',
          options: {
            source: 'name',
            slugify: (input) =>
              input
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .slice(0, 200),
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
        {
          title: 'Official Twitter User',
          name: 'twitter_user',
          type: 'string',
        },
        {
          title: 'Google Place ID',
          name: 'place_id',
          type: 'string',
        },
        {
          title: 'Geolocation',
          name: 'geolocation',
          type: 'geopoint',
        },
        {
          title: 'Zip Code',
          name: 'zip',
          type: 'string',
        },
        {
          title: 'Population',
          name: 'population',
          type: 'number',
        },
      ],
      preview: {
        select: {
          title: 'name',
          description: 'description',
        },
      },
    },

    {
      title: 'Village',
      name: 'community',
      type: 'document',
      icon: FiMapPin,
      fields: [
        {
          title: 'Name',
          name: 'name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'URL',
          name: 'slug',
          type: 'slug',
          options: {
            source: 'name',
            slugify: (input) =>
              input
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .slice(0, 200),
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
        {
          title: 'Google Place ID',
          name: 'place_id',
          type: 'string',
        },
        {
          title: 'Geolocation',
          name: 'geolocation',
          type: 'geopoint',
        },
        {
          title: 'Zip Code',
          name: 'zip',
          type: 'string',
        },
        {
          title: 'Wikidata ID',
          name: 'wikidata_id',
          type: 'string',
        },
        {
          title: 'Visual',
          name: 'image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          title: 'Wikimedia Commons Images',
          name: 'wikimedia_commons_imagelinks',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.unique(),
        },
        {
          title: 'Population',
          name: 'population',
          type: 'number',
        },
        {
          title: 'Geonames ADM3',
          name: 'county_geoname_id',
          type: 'number',
        },
        {
          title: 'Municipality',
          name: 'municipality',
          type: 'reference',
          weak: true,
          to: [{ type: 'municipality' }],
          description: 'To which municipality does that village belong to?',
        },
        {
          title: 'Address aliases',
          name: 'address_aliases',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.unique(),
        },
        {
          title: 'Publication status',
          name: 'publication_status',
          type: 'string',
          options: {
            list: [
              { title: 'Online', value: '0' },
              { title: 'Beta', value: '1' },
              { title: 'Hidden', value: '2' },
              { title: 'Offline', value: '3' },
            ],
            layout: 'dropdown',
          },
        },
      ],
      orderings: [
        {
          title: 'Village',
          name: 'community',
          by: [{ field: 'name', direction: 'asc' }],
        },
      ],
      preview: {
        select: {
          title: 'name',
          municipality: 'municipality.name',
          media: 'image.asset.url',
          wikimedia: 'wikimedia_commons_imagelinks.0',
          description: 'description',
          publication_status: 'publication_status',
          wikidata_id: 'wikidata_id',
        },
        prepare(selection) {
          const {
            title,
            municipality,
            media,
            wikimedia,
            description,
            publication_status,
            wikidata_id = 'Q?',
          } = selection;
          const thumb = wikimedia ? wikimedia : media + '?h=80&w=80&fit=crop';
          return {
            title: title,
            subtitle: `in ${municipality ? municipality : 'MISSING'} (${wikidata_id}, Public? ${publication_status})`,
            media: <img src={thumb} />,
            description: description,
          };
        },
      },
    },

    {
      title: 'Place',
      name: 'place',
      type: 'document',
      icon: FiCrosshair,
      fields: [
        {
          title: 'Name',
          name: 'name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Local name',
          name: 'localname',
          type: 'string',
          description: 'How is the place called within the village context?',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Google Place ID',
          name: 'place_id',
          type: 'string',
        },
        {
          title: 'Wikidata ID',
          name: 'wikidata_id',
          type: 'string',
        },
        {
          title: 'Address',
          name: 'address',
          type: 'string',
        },
        {
          title: 'Address aliases',
          name: 'address_aliases',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.unique(),
        },
        {
          title: 'Geolocation',
          name: 'geolocation',
          type: 'geopoint',
        },
        {
          title: 'Village',
          name: 'community',
          type: 'reference',
          weak: true,
          to: [{ type: 'community' }],
          description: 'To which village does that place belong to?',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Visual',
          name: 'image',
          type: 'image',
        },
        {
          title: 'Wikimedia Commons Images',
          name: 'wikimedia_commons_imagelinks',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.unique(),
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
      ],
      preview: {
        select: {
          title: 'name',
          community: 'community.name',
          description: 'description',
          media: 'image.asset.url',
        },
        prepare(selection) {
          const { title, community, description, media } = selection;
          const thumb = media + '?h=80&w=80&fit=crop';
          return {
            title: title,
            subtitle: `in ${community ? community : 'unknown'}`,
            media: <img src={thumb} />,
            description: description,
          };
        },
      },
    },

    {
      title: 'Organizer',
      name: 'organizer',
      type: 'document',
      icon: FiUser,
      fields: [
        {
          title: 'Name',
          name: 'name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Full name',
          name: 'longname',
          type: 'string',
        },
        {
          title: 'URL',
          name: 'slug',
          type: 'slug',
          options: {
            source: 'name',
            slugify: (input) =>
              input
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .slice(0, 200),
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
        {
          title: 'Google Place ID',
          name: 'place_id',
          type: 'string',
        },
        {
          title: 'Wikidata ID',
          name: 'wikidata_id',
          type: 'string',
        },
        {
          title: 'Website',
          name: 'website',
          type: 'url',
        },
      ],
      preview: {
        select: {
          title: 'name',
          subtitle: 'longname',
        },
      },
    },

    {
      title: 'Calendar',
      name: 'calendar',
      type: 'document',
      icon: FiCalendar,
      fields: [
        {
          title: 'Name',
          name: 'name',
          type: 'string',
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
        {
          title: 'Google Calendar ID',
          name: 'calendar_id',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((calendar_id) => {
              if (typeof calendar_id === 'undefined') {
                return true;
              }
              return calendar_id === calendar_id.trim() ? true : 'Avoid white spaces.';
            }).warning(),
        },
        {
          title: 'Organizer',
          name: 'organizer',
          type: 'reference',
          weak: true,
          to: [{ type: 'organizer' }],
          description: 'Which organizer is responsible?',
        },
        {
          title: 'Publication Scope',
          name: 'scope',
          type: 'string',
          options: {
            list: [
              { title: 'Village', value: '0' },
              { title: 'Municipality', value: '1' },
              { title: 'Surrounding', value: '2' },
              { title: 'Region', value: '3' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Publication status',
          name: 'publication_status',
          type: 'string',
          options: {
            list: [
              { title: 'Online', value: '1' },
              { title: 'Offline', value: '0' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Display mode',
          name: 'display_mode',
          type: 'string',
          options: {
            list: [
              { title: 'Micro (no time)', value: '0' },
              { title: 'Mini (recurring)', value: '1' },
              {
                title: 'One Line (all events per day in one line)',
                value: '4',
              },
              { title: 'Default', value: '2' },
              { title: 'Extended (special events)', value: '3' },
              { title: 'One Line (combine times of multiple events)', value: '5' },
              { title: 'Commercial Ad', value: '6' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Time display mode',
          name: 'time_display_mode',
          type: 'string',
          options: {
            list: [
              { title: 'No time', value: '0' },
              { title: 'Start time only', value: '1' },
              {
                title: 'Start and end time',
                value: '2',
              },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Default Village',
          name: 'community',
          type: 'reference',
          weak: true,
          to: [{ type: 'community' }],
          description: 'To which village events should belong to, when address cannot be geocoded?',
        },
      ],
      initialValue: {
        scope: '0',
        time_display_mode: '2',
      },
      preview: {
        select: {
          title: 'name',
          organizer: 'organizer.name',
        },
        prepare(selection) {
          const { title, organizer } = selection;
          return {
            title: title,
            subtitle: `${organizer ? organizer : 'unknown'}`,
          };
        },
      },
    },

    {
      title: 'Event',
      name: 'event',
      type: 'document',
      icon: FiWatch,
      fields: [
        {
          title: 'Summary',
          name: 'name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
        {
          title: 'Start',
          name: 'start',
          type: 'datetime',
          options: {
            dateFormat: 'DD.MM.YYYY',
            timeFormat: 'HH:mm',
            timeStep: 15,
            calendarTodayLabel: 'Today',
          },
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Allday?',
          name: 'allday',
          type: 'boolean',
        },
        {
          title: 'End',
          name: 'end',
          type: 'datetime',
          options: {
            dateFormat: 'DD.MM.YYYY',
            timeFormat: 'HH:mm',
            timeStep: 15,
            calendarTodayLabel: 'Today',
          },
        },
        {
          title: 'Cancelled?',
          name: 'cancelled',
          type: 'boolean',
        },
        {
          title: 'Location',
          name: 'location',
          type: 'string',
        },
        {
          title: 'Google Event Attachment',
          name: 'googleeventattachment',
          type: 'array',
          of: [{ type: 'googleeventattachment' }],
        },
        {
          title: 'Place',
          name: 'place',
          type: 'reference',
          weak: true,
          // to: [{ type: "place" },{ type: "community" }],
          to: [{ type: 'place' }],
          description: 'At which place does the event happen? Might be a village.',
        },
        {
          title: 'Village',
          name: 'community',
          type: 'reference',
          weak: true,
          to: [{ type: 'community' }],
          description: 'To which village does that place belong to?',
        },
        {
          title: 'Calendar',
          name: 'calendar',
          type: 'reference',
          weak: true,
          to: [{ type: 'calendar' }],
          description: 'To which calendar does the event belong to?',
        },
        {
          title: 'Categories',
          name: 'categories',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.unique(),
        },
        {
          title: 'Google Event ID',
          name: 'event_id',
          type: 'string',
        },
      ],
      preview: {
        select: {
          title: 'name',
          start: 'start',
          community: 'community.name',
        },
        prepare(selection) {
          const { title, start, community } = selection;
          return {
            title: title,
            subtitle: `in ${community ? community : 'unknown'} at ${start ? start : 'unknown'}`,
          };
        },
      },
    },


  ]),
});
