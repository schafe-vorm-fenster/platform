import React from 'react'
import CommunityPreview from './community-preview'

function CommunitytPreviewGrid (props) {
  return (
    <div className="mb-6">

      <ul>
        {props.nodes &&
          props.nodes.map(node => (
            <li id={node.id}>
              <CommunityPreview {...node} />
            </li>
          ))}
      </ul>
    </div>
  )
}

CommunitytPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default CommunitytPreviewGrid
