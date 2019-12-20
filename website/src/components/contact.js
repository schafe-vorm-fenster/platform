import React from 'react'
import fotoChristian from '../../assets/christian.jpg'
import fotoJan from '../../assets/jan.jpg'

function Contact (props) {
  return (
      <div id="contact" className="text-center mb-6">
          <p className="mb-6">Kontaktiere uns gerne direkt. Wir beißen nicht.</p>

          <div className="contactperson">
            <img src={fotoChristian} className="avatar" />
            <h4 className="name">Christian Sauer</h4>
            <p className="role">Projektkoordinator</p>
            <p>
              <a href="mailto:christian@schafe-vorm-fenster.de?cc=jan@schafe-vorm-fenster.de&amp;subject=Hallo Christian.&amp;body=Hallo Christian, ich bin ... komme aus ... und finde Euer Projekt ... Dabei interessiere ich mich besonders für ... und würde gerne wissen ...">christian@schafe-vorm-fenster.de</a>
              <br/>
              <a href="tel:++4915678689704‬">+49 156 78689704‬</a>
            </p>
          </div>

          <div className="contactperson">
            <img src={fotoJan} className="avatar" />
            <h4 className="name">Jan-Henrik Hempel</h4>
            <p className="role">Technischer Leiter</p>
            <p>
              <a href="mailto:jan@schafe-vorm-fenster.de?cc=christian@schafe-vorm-fenster.de&amp;subject=Hallo Jan.&amp;body=Hallo Jan, ich bin ... komme aus ... und finde Euer Projekt ... Dabei interessiere ich mich besonders für ... und würde gerne wissen ...">jan@schafe-vorm-fenster.de</a>
              <br/>
              <a href="tel:++491751661003">+49 175 1661003</a>
            </p>
          </div>
      </div>
  )
}

export default Contact