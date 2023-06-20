//PARTE DE ABAJO C-NEGRO
//Componente Footer de la biblioteca JS React 
  //React: diseñada por Facebook para construir interfaces de usuario (UI) en aplicaciones web. Destaca por la creación de componentes reutilizables (como este Footer, por ejemplo), siendo interfaces dinámicas y escalables. Es de código abierto.
import React from "react";
import logo1 from '../marcaUAM_AhorizontalColor.png'; //Logo de la uni
import logo2 from '../EPS.png'; //Logo de la eps

//Esta función devuelve un JSX (que permite código HTML). JSX es una extensión de sintaxis.
//Está formada por un elemento HTML Footer con dos hijos: GitHub y DONG
//El className se emplea para determinar la Clase CSS de la Hoja de Estilos (global.css)
export function Footer() {
  return (
    <footer className="card-footer"> 
      <a
        className="card-link card-footer-cta"
        href="https://www.linkedin.com/in/daniel-oriol-niso-galan/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Autor: Daniel-Oriol Niso Galán 
      </a>
      
      <div className="card-footer-credits">
        <a
          className="card-link"
          href="https://github.com/Engas027/TFG_2023_ONG"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver repositorio GitHub
        </a> 
      </div> 

      <div className="footer-images">
        <img src={logo1} alt="Logo 1" className="footer-images" />
        <img src={logo2} alt="Logo 2" className="footer-images" />
      </div>

    </footer>
  );
}

//APARECE EN:
//Components/Nav.js
//Pages/Login.js. Lo mete a <FooterComponent>
  //<FooterComponent> se usa también en Components/LoginForm.js