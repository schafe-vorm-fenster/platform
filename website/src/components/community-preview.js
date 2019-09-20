import { Link } from 'gatsby'
import React from 'react'
import { getCommunityUrl } from '../lib/helpers'

function CommunityPreview (props) {
  return (
    <Link to={getCommunityUrl(props.slug.current)}>
      <h3>{props.name} ({props.slug.current})</h3>
    </Link>
  )
}

export default CommunityPreview
