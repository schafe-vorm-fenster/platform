// import { Link } from 'gatsby'
import React from 'react'
import EventPreview from './event-preview'

function MunicipalityEventPreviewGrid (props) {
  const currentCommunityId = props.currentCommunity

  return (
    <>
      {props.nodes &&
        props.nodes.map(node => {
          return node.community._id !== currentCommunityId ?
            <EventPreview {...node} />
            : null
        })}
    </>
  )
}

MunicipalityEventPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default MunicipalityEventPreviewGrid