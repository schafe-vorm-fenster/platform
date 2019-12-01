import React from 'react'
import Img from 'gatsby-image'
import Logo from '../../assets/schafe-vorm-fenster_logo.inline.svg'

function Community (props) {
  const { id, name, description, municipality, image } = props
  return (
    <header className="w-full mb-4 font-sans">
      <div id="community-hero" className="w-full h-hero bg-gray-500 mb-6">
        <Img id="community-image" fluid={image.asset.fluid} className="object-cover h-hero" />
        <Logo id="svf-logo" className="absolute top-0 left-0 m-3 w-1/6 max-w-20" />
      </div>

      <h1 className="text-5xl leading-tight text-center mt-0 pt-0">{name}</h1>
      <p id="community-municipality" className="text-center">{municipality.name}</p>
      <p id="community-description" className="text-center">{description}</p>
      <i>{id}</i>
    </header>
  )
}

export default Community
