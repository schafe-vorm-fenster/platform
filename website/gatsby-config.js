require('dotenv').config()
const {
  api: { projectId, dataset }
} = requireConfig('../studio/sanity.json')

module.exports = {
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId,
        dataset,
        // To enable preview of drafts, copy .env-example into .env,
        // and add a token with read permissions
        token: process.env.SANITY_TOKEN,
        watchMode: true,
        overlayDrafts: true
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Schafe vorm Fenster",
        short_name: "Schafe vorm Fenster",
        start_url: "/",
        background_color: "#B4CF39",
        theme_color: "#B4CF39",
        display: "minimal-ui",
        icon: "src/img/Schafe-vorm-Fenster-UG_Logo_green_Avatar.png",
        crossOrigin: `use-credentials`,
        localize: [
          {
            start_url: `/schlatkow/`,
            lang: `de`,
            name: `Schlatkow`,
            short_name: `Schlatkow`,
          },
        ],
      }
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-postcss',
    { 
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        // develop: true, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
        whitelist: ['whitelist', 'w-'], // Don't remove this selector
        whitelistPatterns: [/^react-tabs/],
        // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      }
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/
        }
      }
    },
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: "Catamaran",
              variants: ["300", "400", "700", "800"],
              fontDisplay: 'swap',
              strategy: 'selfHosted'
            },
          ],
        },
        formats: ['woff2', 'woff'],
        useMinify: true,
        usePreload: true
      }
    }
  ]
}

/**
 * We're requiring a file in the studio folder to make the monorepo
 * work "out-of-the-box". Sometimes you would to run this web frontend
 * in isolation (e.g. on codesandbox). This will give you an error message
 * with directions to enter the info manually or in the environment.
 */

function requireConfig (path) {
  try {
    return require('../studio/sanity.json')
  } catch (e) {
    console.error(
      'Failed to require sanity.json. Fill in projectId and dataset name manually in gatsby-config.js'
    )
    return {
      api: {
        projectId: process.env.SANITY_PROJECT_ID || '',
        dataset: process.env.SANITY_DATASET || ''
      }
    }
  }
}
