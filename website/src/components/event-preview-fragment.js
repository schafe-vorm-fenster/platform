import { graphql } from 'gatsby'

export const query = graphql`
  fragment SanityEventPreview on SanityEvent {
    _id
    name
    start
    end
    allday
    description
    location
    place {
      _id
      name
      localname
      community {
        _id
        name
      }
    }
    community {
      _id
      name
    }
    calendar {
      _id
      name
      scope
      organizer {
        _id
        name
      }
    }
  }
`