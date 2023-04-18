//GH
//La lógica es un mapa para la etiqueta del estado y otro para el color que representa
//Muestra el estado del dispositivo

import React from "react";
import { Link } from "@reach/router";

import { useNotion } from "../services/notion"; //Utiliza biblioteca useNotion

//State
const statesLabels = {
  booting: "Starting OS...",
  shuttingOff: "Shutting off...",
  updating: "Updating OS...",
  online: "Online",
  offline: "Offline"
};

//Booting: sistema iniciandose (nunca los he visto)
//ShuttingOff: sistema apagandose (nunca los he visto)
const stateColors = {
  booting: "darkslategrey",
  shuttingOff: "darkslategrey",
  updating: "orange",
  online: "limegreen",
  offline: "crimson"
};

export function Status() {
  const { status, selectedDevice } = useNotion(); //Variable selectedDevice  y status de useNotion
  const { state, charging, battery, sleepMode } = status || {}; //Si status (objeto) tiene valor hace que las constantes se inicialicen, sino lo inicializa vacío

  //Si el estado es null...
  if (!status) {
    return <div>Conectándose al dispositivo...</div>;
  }

  //Si selectedDevice existe: 
  //muestra el nombre en el encabezado
  //muestra el estado del dispositivo (status)
  //si el dispositivo es online muestra el estado de carga (si charging es verdadero, Cargando...)
  return (
    <aside>
      {selectedDevice ? (
        <h3 className="card-heading">
          <Link
            to="/devices"
            title="My Devices"
            className="unstyled-link"
          >
            <span role="img" aria-label="My Devices">
              ⚙️
            </span>
            &nbsp;&nbsp;
            {selectedDevice.deviceNickname} 
          </Link> 
        </h3>
      ) : null}
      <div className="status-item status-state">
        <span
          className="status-indicator"
          style={{ background: getStatusColor(state) }}
        ></span>
        {state in statesLabels ? statesLabels[state] : state}
      </div>
      {state !== "offline" ? (
        <div className="status-item status-battery">
          <ChargingIcon /> &nbsp;{charging ? "Cargando..." : "Cargado: "} 
          &nbsp;{battery}%
        </div>
      ) : null}
      {sleepMode && state !== "offline" ? (
        <div className="status-item status-sleep-mode">
          <SleepModeIcon /> &nbsp;Sleep Mode
        </div>
      ) : null}
    </aside>
  );
}

function getStatusColor(state) {
  if (state in stateColors) {
    return stateColors[state];
  }

  return stateColors.offline;
}

function ChargingIcon() {
  return (
    <span role="img" aria-label="Electricity">
      &#x26A1;
    </span>
  );
}

function SleepModeIcon() {
  return (
    <span role="img" aria-label="The Moon">
      &#127769;
    </span>
  );
}