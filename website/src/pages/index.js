import React from 'react'
import { graphql } from 'gatsby'
import { mapEdgesToNodes } from '../lib/helpers'
import CommunitytPreviewGrid from '../components/community-preview-grid'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'

export const query = graphql`
  query IndexPageQuery {
    communities: allSanityCommunity(limit: 12, sort: { fields: [name], order: DESC }) {
      edges {
        node {
          id
          name
          slug {
            current
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

  const communityNodes = data && data.communities && mapEdgesToNodes(data.communities)

  return (
    <div>
        <h1>Unsere Dörfer</h1>
        {communityNodes && communityNodes.length > 0 && <CommunitytPreviewGrid nodes={communityNodes} />}
    </div>
  )
}

export default IndexPage
