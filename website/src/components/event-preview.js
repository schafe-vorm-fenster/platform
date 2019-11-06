import { Link } from 'gatsby'
import React from 'react'
import { getEventUrl } from '../lib/helpers'

function EventPreview (props) {
  return (
    <div>
      <Link to={getEventUrl(props.name, props.start)}>
        <h3>{props.name}</h3>
      </Link>
      <div><pre>{JSON.stringify(props, null, 2) }</pre></div>
      <p>{props.allday}</p>
      <p>{props.description}</p>
      <p>{props.start}</p>
      { props.place != null && <p>{props.place.name} ({props.place._id})</p> }
      { props.community.name && <p>{props.community.name} ({props.community._id})</p> }
      <em>{props.id}</em>
    </div>
  )
}

export default EventPreview
