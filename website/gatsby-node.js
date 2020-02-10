const { format } = require('date-fns')
const moment = require('moment')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

async function createCommunityPages (graphql, actions, reporter) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allSanityCommunity(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            _id
            name
            slug {
              current
            }
            place_id
            municipality {
              _id
            }
          }
        }
      }
    }
  `)

  if (result.errors) throw result.errors

  const communityEdges = (result.data.allSanityCommunity || {}).edges || []

  communityEdges.forEach((edge, index) => {
    const { _id, slug = {} } = edge.node
    const path = `/${slug.current}/`
    const municipalityId = edge.node.municipality._id
    const todayOffset = moment().startOf('day').format()
    const todayLimit = moment().endOf('day').format()
    const tomorrowOffset = moment().add(1, 'days').startOf('day').format()
    const tomorrowLimit = moment().add(1, 'days').endOf('day').format()
    const nextdaysOffset = moment().add(2, 'days').startOf('day').format()
    // const nextdaysLimit = moment().add(10, 'days').endOf('day').format()
    const nextdaysLimit = moment().add(60, 'days').endOf('day').format() // set to 60 days until a better sploittig is done

    reporter.info(`Creating community page: ${path}`)

    createPage({
      path,
      component: require.resolve('./src/templates/community.js'),
      context: { _id, municipalityId, todayOffset, todayLimit, tomorrowOffset, tomorrowLimit, nextdaysOffset, nextdaysLimit }
    })
  })
}


// async function createProjectPages (graphql, actions, reporter) {
//   const { createPage } = actions
//   const result = await graphql(`
//     {
//       allSanityProject(filter: { slug: { current: { ne: null } } }) {
//         edges {
//           node {
//             id
//             slug {
//               current
//             }
//           }
//         }
//       }
//     }
//   `)

//   if (result.errors) throw result.errors

//   const projectEdges = (result.data.allSanityProject || {}).edges || []

//   projectEdges.forEach(edge => {
//     const id = edge.node.id
//     const slug = edge.node.slug.current
//     const path = `/project/${slug}/`

//     reporter.info(`Creating project page: ${path}`)

//     createPage({
//       path,
//       component: require.resolve('./src/templates/project.js'),
//       context: { id }
//     })
//   })
// }

exports.createPages = async ({ graphql, actions, reporter }) => {
  await createCommunityPages(graphql, actions, reporter)
}
