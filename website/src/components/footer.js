import React from 'react'
import esfLogo from '../../assets/efre-esf-mv.png'
import Logo from '../../assets/schafe-vorm-fenster_logo.inline.svg'

function Footer (props) {
  return (
    <footer>

      <p className="mb-6">
        <span className="block mb-3">Ein Projekt der</span>
        <span className="block mb-3">
          <Logo id="svf-logo" className="w-1/6 max-w-20 inline-block" />
        </span>
        <span className="font-serif">Schafe vorm Fenster UG</span>
      </p>

      <div id="partner" className="text-center mb-6 px-6">
        <figure className="text-center">
          <figcaption className="figure-caption text-center mb-3">gefördert von der Europäischen Union durch eine Strukturentwicklungsmaßnahme (SEM) des Europäischen Sozialfonds (ESF).</figcaption>
          <img src={esfLogo} className="inline-block" alt="ESF" />
        </figure>
      </div>

      <div id="imprint" className="text-center mb-6">
        <a className="px-3" href="https://www.schafe-vorm-fenster.org/#contact">Kontakt</a> 
        <a className="px-3" href="https://www.schafe-vorm-fenster.org/impressum.html">Impressum</a> 
        <a className="px-3" href="https://www.schafe-vorm-fenster.org/impressum.html#privacy">Datenschutz</a>
      </div>

    </footer>
  )
}

export default Footer