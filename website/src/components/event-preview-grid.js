import { Link } from 'gatsby'
import React from 'react'
import EventPreview from './event-preview'

function EventPreviewGrid (props) {
  return (
    <>
      {props.nodes &&
        props.nodes.map(node => (
            <EventPreview {...node} />
        ))}
    </>
  )
}

EventPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default EventPreviewGrid
