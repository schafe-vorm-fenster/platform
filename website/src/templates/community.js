import React from 'react'
import { graphql } from 'gatsby'
import { mapEdgesToNodes } from '../lib/helpers'
import Layout from '../components/layout'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'
import Community from '../components/community'
import EventPreviewGrid from '../components/event-preview-grid'

export const query = graphql`
  query CommunityTemplateQuery($id: String!) {
    community: sanityCommunity(id: { eq: $id }) {
      id
      slug {
        current
      }
      name
      description
      image {
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
      }
      municipality {
        name
      }
    }

    events: allSanityEvent(filter: { community: { id: { eq: $id } } }, limit: 50, sort: { fields: [name], order: DESC }) {
      edges {
        node {
          id
          name
          start
          allday
          description
          location
          place {
            _id
            name
          }
          community {
            _id
            name
          }
          organizer {
            _id
            name
          }
        }
      }
    }

  }
`

const CommunityTemplate = props => {
  const { data, errors } = props
  const community = data && data.community
  const eventNodes = data && data.events && mapEdgesToNodes(data.events)
  return (
    <Layout>
        {errors && (
          <Container>
            <GraphQLErrorList errors={errors} />
          </Container>
        )}

        {community && <Community {...community} />}

        <h2>Termine</h2>
        <div><pre>{JSON.stringify(eventNodes, null, 2) }</pre></div>
        {eventNodes && eventNodes.length > 0 && <EventPreviewGrid nodes={eventNodes} />}
    </Layout>
  )
}

export default CommunityTemplate
