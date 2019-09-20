import { Link } from 'gatsby'
import React from 'react'
import EventPreview from './event-preview'

function EventPreviewGrid (props) {
  return (
    <div>
      {props.name && (
        <h2>
          {props.browseMoreHref ? (
            <Link to={props.browseMoreHref}>{props.title}</Link>
          ) : (
            props.name
          )}
        </h2>
      )}
      <ul>
        {props.nodes &&
          props.nodes.map(node => (
            <li key={node.id}>
              <EventPreview {...node} />
            </li>
          ))}
      </ul>
      {props.browseMoreHref && (
        <div>
          <Link to={props.browseMoreHref}>Browse more</Link>
        </div>
      )}
    </div>
  )
}

EventPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default EventPreviewGrid
