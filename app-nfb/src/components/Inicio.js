import React, { useState } from "react";
import { Brainwaves } from "./Brainwaves"; // Importa el componente existente

export function Inicio() {
  const [iniciado, setIniciado] = useState(false);

  const handleInicioClick = () => {
    // Puedes realizar cualquier inicialización adicional aquí si es necesario
    setIniciado(true);
  };

  return (
    <div className="inicio-container">
      {!iniciado ? (
        <div className="inicio">
          <h1>Bienvenido a la Aplicación de Medición Cerebral</h1>
          <p>Haz clic en el botón para comenzar la medición.</p>
          <button onClick={handleInicioClick}>Iniciar Medición</button>
        </div>
      ) : (
        <Brainwaves /> // Muestra el componente Brainwaves una vez iniciado
      )}
    </div>
  );
}
