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
import { Helmet } from 'react-helmet'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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
        twitter_user
      }
    }

    todayEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, calendar: { publication_status: { ne: "0" } }, start: { gt: $todayOffset, lt: $todayLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }

    tomorrowEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, calendar: { publication_status: { ne: "0" } }, start: { gt: $tomorrowOffset, lt: $tomorrowLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }

    homeEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, calendar: { publication_status: { ne: "0" } }, start: { gt: $todayOffset, lt: $tomorrowLimit } }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }

    nextdaysEvents: allSanityEvent(filter: { community: { _id: { eq: $_id } }, calendar: { publication_status: { ne: "0" } }, start: { gt: $nextdaysOffset, lt: $nextdaysLimit} }, limit: 50, sort: { fields: [start, allday], order: ASC }) {
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
        },
        publication_status: { 
          ne: "0" 
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
        limit: 20, sort: { fields: [start, allday], order: ASC }
      ) {
      edges {
        node {
          ...SanityEventPreview
        }
      }
    }

    homeEventsInMunicipality: allSanityEvent(filter: {
      calendar: {
        scope : {
          eq: "1"
        },
        publication_status: { 
          ne: "0" 
        }
      },
      start: { 
        gt: $todayOffset, 
        lt: $tomorrowLimit 
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
        limit: 20, sort: { fields: [start, allday], order: ASC }
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
  const homeEventsInMunicipalityNodes = data && data.homeEventsInMunicipality && mapEdgesToNodes(data.homeEventsInMunicipality)
  const homeEventsNodes = data && data.homeEvents && mapEdgesToNodes(data.homeEvents)
  const desc = community.name + ', Gemeinde ' + community.municipality.name
  const canonical = 'https://schafe-vorm-fenster.de/' + community.slug.current + '/'

  return (
    <Layout>
        <Helmet defer={false}>
          <title>{community.name}</title>
          <meta name="apple-mobile-web-app-title" content={community.name} />
          <meta name="application-name" content={community.name} />
          <meta name="description" content={desc} />
          <link rel="canonical" href={canonical} />
        </Helmet>
        {errors && (
          <Container>
            <GraphQLErrorList errors={errors} />
          </Container>
        )}
        <Community {...community} />

        { !community.municipality.twitter_user  && 
            <>
              { todayEventNodes && todayEventNodes.length > 0 && <section id="today" className="eventblock">
                <h2><span>Heute</span></h2>
                <EventPreviewGrid nodes={todayEventNodes} />
              </section> }

              { tomorrowEventNodes && tomorrowEventNodes.length > 0 && <section id="tomorrow" className="eventblock">
                <h2><span>Morgen</span></h2>
                <EventPreviewGrid nodes={tomorrowEventNodes} />
              </section> }

              { nextdaysEventNodes && nextdaysEventNodes.length > 0 && <section id="nearfuture" className="eventblock">
                <h2><span>In den kommenden Tagen</span></h2>
                <EventPreviewGrid nodes={nextdaysEventNodes} />
              </section> }

              {eventsInMunicipalityNodes && eventsInMunicipalityNodes.length > 0 && <section id="municipality" className="eventblock">
                <h2><span>In der Gemeinde</span></h2>
                <MunicipalityEventPreviewGrid currentCommunity={community._id} nodes={eventsInMunicipalityNodes} />
              </section> }
            </>
        }

        { community.municipality.twitter_user && 
          <Tabs>
              <TabList>
                <Tab>Aktuell</Tab>
                <Tab>Nachrichten</Tab>
                <Tab>Termine</Tab>
              </TabList> 

            <TabPanel>
              {homeEventsNodes && homeEventsNodes.length > 0 && <section id="today" className="eventblock">
                <EventPreviewGrid nodes={homeEventsNodes} />
              </section> }
              
              { homeEventsInMunicipalityNodes && homeEventsInMunicipalityNodes.length > 0 && 
                <section id="municipality" className="eventblock">
                  <h2><span>In der Gemeinde</span></h2>
                  <MunicipalityEventPreviewGrid currentCommunity={community._id} nodes={homeEventsInMunicipalityNodes} />
                </section>      
              }
              
              <section id="today" className="eventblock">
                <h2><span>Nachrichten</span></h2>
                <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName={community.municipality.twitter_user}
                    noScrollbar
                    noHeader
                    noFooter
                    noBorders
                    lang="de"
                    options={{tweetLimit: 3}}
                  />
                </section>
            </TabPanel>
            <TabPanel>
               <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName={community.municipality.twitter_user}
                  noScrollbar
                  noHeader
                  noFooter
                  noBorders
                  lang="de"
                />
            </TabPanel>
            <TabPanel>
              { todayEventNodes && todayEventNodes.length > 0 && <section id="today" className="eventblock">
                <h2><span>Heute</span></h2>
                <EventPreviewGrid nodes={todayEventNodes} />
              </section> }

              { tomorrowEventNodes && tomorrowEventNodes.length > 0 && <section id="tomorrow" className="eventblock">
                <h2><span>Morgen</span></h2>
                <EventPreviewGrid nodes={tomorrowEventNodes} />
              </section> }

              { nextdaysEventNodes && nextdaysEventNodes.length > 0 && <section id="nearfuture" className="eventblock">
                <h2><span>In den kommenden Tagen</span></h2>
                <EventPreviewGrid nodes={nextdaysEventNodes} />
              </section> }

              {eventsInMunicipalityNodes && eventsInMunicipalityNodes.length > 0 && <section id="municipality" className="eventblock">
                <h2><span>In der Gemeinde</span></h2>
                <MunicipalityEventPreviewGrid currentCommunity={community._id} nodes={eventsInMunicipalityNodes} />
              </section> }
            </TabPanel>
        </Tabs>
      }







    </Layout>
  )
}

export default CommunityTemplate
