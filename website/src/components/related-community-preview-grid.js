import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

function RelatedCommunitytPreviewGrid (props) {
  return (
    <div>

      <ul>
        {props.nodes &&
          props.nodes.map(node => (
            <li id={node._id}>
              {node._id} {node.name}
            </li>
          ))}
      </ul>
    </div>
  )
}

RelatedCommunitytPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default RelatedCommunitytPreviewGrid
