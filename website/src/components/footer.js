import React from 'react'
import esfLogo from '../../assets/efre-esf-mv.jpg'

function Footer (props) {
  return (
    <footer>

      <p className="mb-6">
        Ein Projekt der Schafe vorm Fenster UG.
      </p>

      <div id="partner" className="text-center mb-6">
        <figure className="text-center">
          <img src={esfLogo} className="inline-block mb-3" alt="ESF" />
          <figcaption class="figure-caption text-center">Gefördert von der Europäischen Union durch eine Strukturentwicklungsmaßnahme des Europäischer Sozialfonds (ESF).</figcaption>
        </figure>
      </div>

      <div id="imprint" className="text-center mb-6">
        <a class="px-3" href="https://www.schafe-vorm-fenster.org/#contact">Kontakt</a> 
        <a class="px-3" href="https://www.schafe-vorm-fenster.org/impressum.html">Impressum</a> 
        <a class="px-3" href="https://www.schafe-vorm-fenster.org/impressum.html#privacy">Datenschutz</a>
      </div>

    </footer>
  )
}

export default Footer