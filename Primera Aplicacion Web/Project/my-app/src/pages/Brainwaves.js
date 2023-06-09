//GH
//ESTADO. La instancia de Neurosity y User se sincronizan con un Efecto Secundario creando una suscripción a la API de Calm
//GH
//ESTADO. La instancia de Neurosity y User se sincronizan con un Efecto Secundario creando una suscripción a la API de Calm
import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";

import "./Brainwaves.css";
import calmPic from '../pages/calmpic.jpg';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${formattedSeconds}`;
}

export function Brainwaves() {
  const { user } = useNotion();
  const [blurAmount, setBlurAmount] = useState(0);
  const [brainwaves, setBrainwaves] = useState(0);
  const [alphaChM, setAlphaChM] = useState(0);
  const [alert, setAlert] = useState("");
  const [testFinished, setTestFinished] = useState(false);
  const [scoreClass, setScoreClass] = useState("");
  const [showPixelatedImage, setShowPixelatedImage] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutos en segundos (primera fase)
  const [showAlphaChM, setShowAlphaChM] = useState(false); // Para mostrar los valores con la Imagen Fija 





  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timer = setInterval(() => {
      setTimerSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (timerSeconds === 0) {
      clearInterval(timer);
      setShowTimer(false);
      setShowPixelatedImage(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timerSeconds, user]);

  useEffect(() => {
    if (!user || showTimer) {
      return;
    }

    const subscription = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
      const alphaCh1 = brainwaves.data.alpha[1];
      const alphaCh3 = brainwaves.data.alpha[3];
      const alphaChM = (alphaCh1 + alphaCh3) / 2;

      setAlphaChM(alphaChM);

      if (alphaChM > 10) {
        setAlert("Te duermes coleguita");
        setScoreClass("score-red");
      } else {
        setAlert("");
        setScoreClass("score-green");
      }
    });

    setTimeout(() => {
      setTestFinished(true);
      setAlert("Proceso de Imagen Pixelada finalizado");
      subscription.unsubscribe();
    }, 180000); // 3 minutos en milisegundos con su mensaje de alerta

    return () => {
      subscription.unsubscribe();
    };
  }, [user, showTimer]);


  return (
    <main className="main-container">
      {user ? <Nav /> : null}

      {showTimer && ( //Temporizador primeros 3 min
        <div className="timer-container">
          <div className="timer">{formatTime(timerSeconds)}</div>
        </div>
      )}

      <div className="brainwaves-container"> 
        <div className="brainwaves-label">PowerByBand-Alpha (C1 y C3)</div>
        <div className={`brainwaves-score ${scoreClass}`}>{alphaChM.toFixed(2)}</div>
      </div>

      {alert && <div className="alert">{alert}</div>}
  
      {!showPixelatedImage && ( 
        <div className="calm-image">
          <img src={calmPic} alt="My hola"/>
          {showTimer && <div className="timer-message">Proceso de Imagen Fija</div>}
        </div>
      )}
  
      {showPixelatedImage && ( //Cuando finaliza el temporizador primero de 3 min, showTimer se pone false y showPixelatedImage true.
        <div className="calm-image">
          <img src={calmPic} alt="My hola" style={{ filter: `blur(${blurAmount}px)` }}/>
          <div className="timer-message">Proceso de Imagen Pixelada</div>
        </div>
      )}

      {testFinished && <div className="test-finished-text">Prueba finalizada</div>}
  
    </main>
  );
  


      }
