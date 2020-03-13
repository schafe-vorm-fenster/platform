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
    community {
      _id
      name
    }
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
      display_mode
      organizer {
        _id
        name
        longname
      }
    }
  }
`