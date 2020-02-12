import React from 'react'
import { graphql } from 'gatsby'
import { mapEdgesToNodes } from '../lib/helpers'
import Layout from '../components/layout'
import CommunitytPreviewGrid from '../components/community-preview-grid'
import GraphQLErrorList from '../components/graphql-error-list'
import Logo from '../../assets/schafe-vorm-fenster_logo.inline.svg'

export const query = graphql`
  query IndexPageQuery {
    onlioneCommunities: allSanityCommunity(filter: { publication_status: { in: ["0"] } }, limit: 100, sort: { fields: [name], order: ASC }) {
      edges {
        node {
          id
          name
          slug {
            current
          }
          municipality {
            id
            name
          }
        }
      }
    },
    betaCommunities: allSanityCommunity(filter: { publication_status: { in: ["1"] } }, limit: 100, sort: { fields: [name], order: ASC }) {
      edges {
        node {
          id
          name
          slug {
            current
          }
          municipality {
            id
            name
          }
        }
      }
    },
    upcomingCommunities: allSanityCommunity(filter: { publication_status: { in: ["2"] } }, limit: 100, sort: { fields: [name], order: ASC }) {
      edges {
        node {
          id
          name
          slug {
            current
          }
          municipality {
            id
            name
          }
        }
      }
    }

  }
`

const IndexPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <div>
        <GraphQLErrorList errors={errors} />
      </div>
    )
  }

  const onlineCommunityNodes = data && data.onlioneCommunities && mapEdgesToNodes(data.onlioneCommunities)
  const betaCommunityNodes = data && data.betaCommunities && mapEdgesToNodes(data.betaCommunities)
  const upcomingCommunityNodes = data && data.upcomingCommunities && mapEdgesToNodes(data.upcomingCommunities)

  return (
    <div>
      <Layout>
        <header className="text-center">
          <Logo id="svf-logo" className="inline-block object-none object-center m-3 w-1/6 max-w-20" />
        </header>
        <section className="p-3 text-center">
          <h1 className="text-3xl leading-tight text-center mt-0 pt-0 mb-4">Unsere Dörfer</h1>
          {onlineCommunityNodes && onlineCommunityNodes.length > 0 && <CommunitytPreviewGrid nodes={onlineCommunityNodes} />}
          <h1 className="text-3xl leading-tight text-center mt-0 pt-0 mb-4">In der Beta Phase</h1>
          {betaCommunityNodes && betaCommunityNodes.length > 0 && <CommunitytPreviewGrid nodes={betaCommunityNodes} />}
          <h1 className="text-3xl leading-tight text-center mt-0 pt-0 mb-4">In Planung</h1>
          {upcomingCommunityNodes && upcomingCommunityNodes.length > 0 && <CommunitytPreviewGrid nodes={upcomingCommunityNodes} />}
        </section>
      </Layout>
    </div>
  )
}

export default IndexPage
