import { Link } from 'gatsby'
import React from 'react'
import { getEventUrl } from '../lib/helpers'

function EventPreview (props) {
  return (
    <div>
      <Link to={getEventUrl(props.name, props.start)}>
        <h3>{props.name}</h3>
      </Link>
      <p>{props.start}</p>
      <p>{props.place.name}</p>
      <em>{props.id}</em>
    </div>
  )
}

export default EventPreview
