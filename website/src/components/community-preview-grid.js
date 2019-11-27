import React from 'react'
import CommunityPreview from './community-preview'

function CommunitytPreviewGrid (props) {
  return (
    <div>

      <ul>
        {props.nodes &&
          props.nodes.map(node => (
            <li key={node.id}>
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
