import React from 'react'
import { graphql } from 'gatsby'
import { mapEdgesToNodes } from '../lib/helpers'
import Layout from '../components/layout'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'
import Community from '../components/community'
import EventPreviewGrid from '../components/event-preview-grid'
import MunicipalityEventPreviewGrid from '../components/municipality-event-preview-grid'
import '../components/event-preview-fragment'

export const query = graphql`
  query CommunityTemplateQuery($_id: String!, $municipalityId: String!, $todayOffset: Date!, $todayLimit: Date!, $tomorrowOffset: Date!, $tomorrowLimit: Date!, $nextdaysOffset: Date!, $nextdaysLimit: Date!) {

    community: sanityCommunity(_id: { eq: $_id }) {
      _id
      slug {
        current
      }
      name
      description
      publication_status
      image {
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
      }
      municipality {
        _id
        name
      }
    }

    todayEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, start: { gt: $todayOffset, lt: $todayLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }

    tomorrowEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, start: { gt: $tomorrowOffset, lt: $tomorrowLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }

    nextdaysEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, start: { gt: $nextdaysOffset, lt: $nextdaysLimit} }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }
  
    eventsInMunicipality: allSanityEvent(filter: {
      calendar: {
        scope : {
          eq: "1"
        }
      },
      community: {
        municipality: {
          _id: {
            eq: $municipalityId 
          }
        },
        _id: { 
          ne: $_id 
        }
      }},
        limit: 50, sort: { fields: [start, allday], order: ASC }
      ) {
      edges {
        node {
          ...SanityEventPreview
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
  const eventsInMunicipalityNodes = data && data.eventsInMunicipality && mapEdgesToNodes(data.eventsInMunicipality)

  return (
    <Layout>
        {errors && (
          <Container>
            <GraphQLErrorList errors={errors} />
          </Container>
        )}
        <Community {...community} />

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

        <section id="municipality" className="eventblock">
          <h2><span>In der Gemeinde</span></h2>
          {eventsInMunicipalityNodes && eventsInMunicipalityNodes.length > 0 && <MunicipalityEventPreviewGrid currentCommunity={community._id} nodes={eventsInMunicipalityNodes} />}
        </section>

    </Layout>
  )
}

export default CommunityTemplate
