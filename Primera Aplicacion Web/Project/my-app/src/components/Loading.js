//Este componente (loading) se utiliza para mostrar el indicador de carga de contenido de la biblioteca React
//No recibe entradas, simplemente devuelve la estructura html de los elementos que indican la carga de contenido: en proceso, congelada, etc.
//Spinner de carga: gráfico animado para indicar que se procesa algo

import React from "react";

export function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" /> 
    </div>
  );
}

//APARECE EN:

//Devices.js(pages): usado para deshbalitar el botón de envío de formulario, mostrando un mensaje de carga hasta completar la operación. loading: Función Booleana.
  //Si loading=True, se muestra "Cargando Dispositivos..."
  //Si loading=False, se muestra "Seleccionar"

//Login.js(pages): usado como Propiedad que pasa al Componente LoginForm con el valor de isLoggingIn
  //IsLoggingIn: se está procesando el inicio de sesión?
  //Si IsLoggingIn=True, se muestra mensaje de carga
  //Si IsLoggingIn=False, no se muestra mensaje de carga, la Propiedad loading es FALSA

//App.js(Out): usado como Función Booleana para un return
  //Si loadingUser=True (se está cargando el usuario), se devuelve el Componente Loading: cargando página
  //Si loadingUser=False (no se está cargando el usuario), se devuelve el Componente Router (Que contiene todas las Pages).

//LoginForm.js (Components): pasa a True si onLogin confirma las credenciales del usuario
