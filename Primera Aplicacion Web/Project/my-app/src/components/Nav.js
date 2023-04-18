//GH
//Obtiene la información del dispositivo, muestra el componente Status y tiene botón de cierre de sesión
import React from "react";
import { navigate } from "@reach/router"; 
import { Status } from "./Status"; //Componente: Status.js
import { Footer } from "./Footer"; //Componente: Footer.js

export function Nav() {
  function goToLogout() {
    navigate("/logout"); //Función navigate de la librería @reach/router que redirige al user a la pag de cierre de sesión
  }

  return (
    <nav className="card">
      <Status />
      <button onClick={goToLogout} className="card-btn">
        Cerrar sesión
      </button>
      <Footer />
    </nav>
  );
}