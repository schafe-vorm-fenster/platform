import React from 'react'
import { graphql } from 'gatsby'
import { mapEdgesToNodes } from '../lib/helpers'
import Layout from '../components/layout'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'
import Community from '../components/community'
import EventPreviewGrid from '../components/event-preview-grid'

export const query = graphql`
  query CommunityTemplateQuery($id: String!, $todayOffset: Date!, $todayLimit: Date!, $tomorrowOffset: Date!, $tomorrowLimit: Date!, $nextdaysOffset: Date!, $nextdaysLimit: Date!) {
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

    todayEvents: allSanityEvent(filter: { community: { id: { eq: $id } }, start: { gt: $todayOffset, lt: $todayLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          id
          name
          start
          end
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

    tomorrowEvents: allSanityEvent(filter: { community: { id: { eq: $id } }, start: { gt: $tomorrowOffset, lt: $tomorrowLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          id
          name
          start
          end
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

    nextdaysEvents: allSanityEvent(filter: { community: { id: { eq: $id } }, start: { gt: $nextdaysOffset, lt: $nextdaysLimit} }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          id
          name
          start
          end
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
  const todayEventNodes = data && data.todayEvents && mapEdgesToNodes(data.todayEvents)
  const tomorrowEventNodes = data && data.tomorrowEvents && mapEdgesToNodes(data.tomorrowEvents)
  const nextdaysEventNodes = data && data.nextdaysEvents && mapEdgesToNodes(data.nextdaysEvents)
  return (
    <Layout>
        {errors && (
          <Container>
            <GraphQLErrorList errors={errors} />
          </Container>
        )}
        {community && <Community {...community} />}

        <section id="today" className="eventblock">
          <h2><span>Heute</span></h2>
          {todayEventNodes && todayEventNodes.length > 0 && <EventPreviewGrid nodes={todayEventNodes} />}
        </section>

        <section id="tomorrow" className="eventblock">
          <h2><span>Morgen</span></h2>
          {tomorrowEventNodes && tomorrowEventNodes.length > 0 && <EventPreviewGrid nodes={tomorrowEventNodes} />}
        </section>

        <section id="nearfuture" className="eventblock">
          <h2><span>In den kommenden Tagen</span></h2>
          {nextdaysEventNodes && nextdaysEventNodes.length > 0 && <EventPreviewGrid nodes={nextdaysEventNodes} />}
        </section>

    </Layout>
  )
}

export default CommunityTemplate
