const { format } = require('date-fns')

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
            id
            name
            slug {
              current
            }
            place_id
          }
        }
      }
    }
  `)

  if (result.errors) throw result.errors

  const communityEdges = (result.data.allSanityCommunity || {}).edges || []

  communityEdges.forEach((edge, index) => {
    const { id, slug = {} } = edge.node
    const path = `/${slug.current}/`

    reporter.info(`Creating community/village page: ${path}`)

    createPage({
      path,
      component: require.resolve('./src/templates/community.js'),
      context: { id }
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
