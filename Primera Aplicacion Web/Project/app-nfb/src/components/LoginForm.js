//El Componente es un formulario HTML de inicio de sesion. 
//La funcion LoginForm recibe 4 Propiedades:  
  //onLogin: se ejecuta al hacer click en Iniciar sesión
  //loading: cuando el envío del formulario está en curso
  //error: mensaje al haber error

//AUTENTICACION. 

import React, { useState } from "react";

export function LoginForm({ onLogin, loading, error, footerComponent }) {
  const [deviceId, setDeviceId] = useState(""); 
  const [email, setEmail] = useState(""); //Estado 1: se inicializa vacío
  const [password, setPassword] = useState(""); //Estado 2: se inicializa vacío

  function onSubmit(event) {
    event.preventDefault(); //Event es un Objeto y preventDefault un método (para que el envío del formulario se produzca en la aplicación y no en el servidor)
    onLogin({ email, password }); //Les pasa los dos objetos a onLogin
  }

  return (
    <form className="card login-form" onSubmit={onSubmit}>
      <h3 className="card-heading">Inicio de Sesión</h3>
      {!!error ? <h4 className="card-error">{error}</h4> : null}

      <div className="row">
        <label>E-mail:</label>
        <input
          type="email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="row">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="row">
        <button type="submit" className="card-btn" disabled={loading}>
          {loading ? "Accediendo..." : "Acceder"}
        </button>
      </div>

      {footerComponent}
    </form>
  );
}