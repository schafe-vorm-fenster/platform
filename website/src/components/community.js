import React from 'react'

function Community (props) {
  const { id, name, description, municipality } = props
  return (
    <div>
        <h1>{name}</h1>
        <p>{municipality.name}</p>
        <p>{description}</p>
        <i>{id}</i>
    </div>
  )
}

export default Community
