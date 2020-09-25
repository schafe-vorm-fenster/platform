import React from 'react';
import { useBreakpoints, useComponentSize } from "react-use-size";
import fotoChristian from '../../assets/christian.jpg';
import fotoJan from '../../assets/jan.jpg';

function Contact (props) {

  const { ref, height, width } = useComponentSize();
  const [s, m, l] = [500, 600, 700].map(breakpoint => width >= breakpoint);
  
  function getClassName(arr){
      let index = 0;
      if(l && arr[2]) return arr[2];
      if(m && arr[1]) return arr[1];
      if(l && arr[0]) return arr[0];
      return arr[0];
  }

  return (
    <div id="contact" ref={ref}>
      <p className="mb-6 text-center">Kontaktiere uns gerne direkt. Wir beißen nicht.</p>
      <div  className="text-center mb-6 grid grid-cols-2 gap-5">
          <div className={ 'contactperson ' + getClassName(['col-span-2','col-span-1'])}>
            <img src={fotoChristian} className="avatar mb-3" />
            <h4 className="name">Christian Sauer</h4>
            <p className="role">Projektkoordinator</p>
            <p>
              <a href="mailto:christian@schafe-vorm-fenster.de?cc=jan@schafe-vorm-fenster.de&amp;subject=Hallo Christian.&amp;body=Hallo Christian, ich bin ... komme aus ... und finde Euer Projekt ... Dabei interessiere ich mich besonders für ... und würde gerne wissen ...">christian@schafe-vorm-fenster.de</a>
              <br/>
              <a href="tel:++4915678689704‬">+49 156 78689704‬</a>
            </p>
          </div>
          <div className={ 'contactperson ' + getClassName(['col-span-2','col-span-1'])}>
            <img src={fotoJan} className="avatar mb-3" />
            <h4 className="name">Jan-Henrik Hempel</h4>
            <p className="role">Technischer Leiter</p>
            <p>
              <a href="mailto:jan@schafe-vorm-fenster.de?cc=christian@schafe-vorm-fenster.de&amp;subject=Hallo Jan.&amp;body=Hallo Jan, ich bin ... komme aus ... und finde Euer Projekt ... Dabei interessiere ich mich besonders für ... und würde gerne wissen ...">jan@schafe-vorm-fenster.de</a>
              <br/>
              <a href="tel:++491751661003">+49 175 1661003</a>
            </p>
          </div>
      </div>
    </div>
  )
}

export default Contact


