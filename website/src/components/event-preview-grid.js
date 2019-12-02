import { Link } from 'gatsby'
import React from 'react'
import EventPreview from './event-preview'

function EventPreviewGrid (props) {
  return (
    <section id="eventlist" className="w-full p-3">
      <h2 className="invisible">Termine im Grid</h2>
      <ul>
        {props.nodes &&
          props.nodes.map(node => (
            <li key={node.id}>
              <EventPreview {...node} />
            </li>
          ))}
      </ul>
    </section>
  )
}

EventPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default EventPreviewGrid
