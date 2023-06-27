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

import { Line } from "react-chartjs-2";


export function Brainwaves() {

  const { user } = useNotion();
  const [alphaChM, setAlphaChM] = useState(0);
  const [signalQ, setSignalQ] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const [alert, setAlert] = useState("");
  const [calibrationFinished, setCalibrationFinished] = useState(false);
  const [neurofeedbackFinished, setNeurofeedbackFinished] = useState(false);
  const [scoreClass, setScoreClass] = useState("");
  const [timerSecCalibration, setTimerSecCalibration] = useState(3); // en segundos 
  const [timerSecNeurofeedback, setTimerSecNeurofeedback] = useState(timerSecCalibration + (3)); // en segundos
  const [calibrationData, setCalibrationData] = useState([]);
  const [calibrationSQData, setCalibrationSQData] = useState([]);
  const [neurofeedbackData, setNeurofeedbackData] = useState([]);
  const [calculatedValues, setCalculatedValues] = useState(null);
  const [showPixelatedImage, setShowPixelatedImage] = useState(false);
  const [showTimerCalibration, setShowTimerCalibration] = useState(true);
  const [showTimerNeurofeedback, setShowTimerNeurofeedback] = useState(false);
  const [showAlphaValues, setShowAlphaValues] = useState(true);
  const [chartData, setChartData] = useState(null);

  // LOGIN
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);


 // MIDE ALPHA - CALIBRACIÓN
  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
      const alphaCh1 = brainwaves.data.alpha[4]; //PO3
      const alphaCh2 = brainwaves.data.alpha[5]; //PO4
      const alphaChMe = (alphaCh1 + alphaCh2) / 2; // average of PO3 and PO4
      setAlphaChM(alphaChMe);

      if (!calibrationFinished) {
        setCalibrationData((prevData) => [...prevData, { alpha: parseFloat(alphaChMe.toFixed(3)) }]);
      }
      
      // Aqui no hay feedback rojo/verde porque es la calibracion
      setAlert("");
      setScoreClass("");//white
    });

    /*
    const subscriptionSQ = notion.signalQuality().subscribe((signalQuality) => {
      const sigQ = signalQuality[4];
      if (!calibrationFinished) {
        setCalibrationSQData((prevData) => [...prevData, { sigQ: parseFloat(sigQ.toFixed(3)) }]);
      }
    });
*/

    if (timerSecCalibration === 0) {
      // Finaliza la subscripcion
      setAlert(<strong>¡Calibracion!</strong>);
      subscription.unsubscribe();
     // subscriptionSQ.unsubscribe();

      setCalibrationFinished(true);

      return;
    }

    return () => {
      subscription.unsubscribe();
    //  subscriptionSQ.unsubscribe();

    };
  }, [user, calibrationFinished]);
  
  /*
  useEffect(() => {
    if (calibrationFinished) {
      //const chartValues = calibrationData.map((row) => row.alpha);

      setChartData({
        labels: ["A"], //Array.from({ length: chartValues.length }, (_, i) => i.toString()),
        datasets: [
          {
            label: "Calibration Data",
            data: [1],//chartValues,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    }
  }, [calibrationFinished, calibrationData]);
*/

 // MIDE ALPHA - NEUROFEEDBACK
  useEffect(() => {
    if (!user | !calibrationFinished) {
      return;
    }

    setAlert("MIDE ALPHA - NEUROFEEDBACK");

    const subscriptionN = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
      const alphaCh1 = brainwaves.data.alpha[4]; //PO3
      const alphaCh2 = brainwaves.data.alpha[5]; //PO4
      const alphaChMe = (alphaCh1 + alphaCh2) / 2; // average of PO3 and PO4
      setAlphaChM(alphaChMe);

      if (!neurofeedbackFinished) {
        setNeurofeedbackData((prevData) => [...prevData, { alpha: parseFloat(alphaChMe.toFixed(3)) }]);
        setBlurAmount(3);
      }
      
      setAlert("");
      // este 10 debería ir en funcion de la calibracion
      //if (alphaChM > 0.6) {
        //setScoreClass("score-red");
      //} else {
        //setAlert("");
        //setScoreClass("score-green");
      //}

      // Calibrando: a valor alpha mas pequeño, más borroso
      // Casos extremos:
      // - Alpha muy alta: alphaNorm = 1 o mayor que 1 --> ratioAñpha = 0 o menor que 0
      // - Alpha muy baja: alphaNorm = 0 --> ratioApha = 10
      // - Alpha intermedio: alphaNorm =0.5 --> ratioAlpha = 5
      const alphaNorm = alphaChM/calibrationData.maxValue; //calculatedValues.range4;
      const ratioAlpha = 10* (1-alphaNorm);

  /*
      if (ratioAlpha <0) {
        setBlurAmount(0); //no desenfoque
      } else {
        setBlurAmount(ratioAlpha);
      }*/
      
    });
    
    if (timerSecNeurofeedback === 0) {
      // Finaliza la subscripcion
      setAlert(<strong>¡Muchas gracias!</strong>);
      subscriptionN.unsubscribe();
      setNeurofeedbackFinished(true);
    }

    return () => {
      subscriptionN.unsubscribe();
    };
  }, [calibrationFinished, neurofeedbackFinished]);
  

  

  // TIMER - CALIBRATION
  useEffect(() => {
    if (!user) {
      return;
    }
    const timer = setInterval(() => {
      setTimerSecCalibration((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (timerSecCalibration === 0) {
      clearInterval(timer);
      // Esconde el reloj de calibracion y muestra el de neurofeedback
      setShowTimerCalibration(false);
      setShowTimerNeurofeedback(true);
      // Proceso de calibracion terminado
      setShowPixelatedImage(true);

      setCalibrationFinished(true);
      setNeurofeedbackFinished(false);

    }
    return () => {
      clearInterval(timer);
    };
  }, [user, timerSecCalibration]);


  // TIMER - NEUROFEEDBACK
  useEffect(() => {
    if (!user) {
      return;
    }
    const timer = setInterval(() => {
      setTimerSecNeurofeedback((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (timerSecNeurofeedback === 0) {
      clearInterval(timer);
      setShowTimerNeurofeedback(true);
     // Proceso de calibracion terminado
      setShowPixelatedImage(true);

      setNeurofeedbackFinished(true);

    }
    return () => {
      clearInterval(timer);
    };
  }, [user, timerSecNeurofeedback]);


 // SAVE DATA TO CSV - CALIBRATION
  useEffect(() => {
    if (calibrationFinished) {
      appendDataToCSV(calibrationData, 'calibration.csv');
    //  appendDataToCSV(calibrationSQData, 'calibrationSQ.csv');

      const calculatedValues = calculateValues(calibrationData);
      setCalculatedValues(calculatedValues);
    }
  }, [calibrationFinished, calibrationData]);

  
   // SAVE DATA TO CSV - NEUROFEEDBACK
   useEffect(() => {
    if (neurofeedbackFinished) {
      appendDataToCSV(neurofeedbackData, 'neurofeedback.csv');
      const calculatedValues = calculateValues(neurofeedbackData);
      setCalculatedValues(calculatedValues);
    }
  }, [neurofeedbackFinished, neurofeedbackData]);

  // CALCULA VALORES DE LA CALIBRACION
  useEffect(() => {
    if (calculatedValues) {
      console.log("Max Value:", calculatedValues.maxValue);
      console.log("Min Value:", calculatedValues.minValue);
      console.log("Total:", calculatedValues.total);
      console.log("Start:", calculatedValues.start);
      console.log("End:", calculatedValues.end);
      console.log("Total2:", calculatedValues.total2);
      console.log("Range1:", calculatedValues.range1);
      console.log("Range2:", calculatedValues.range2);
      console.log("Range3:", calculatedValues.range3);
      console.log("Range4:", calculatedValues.range4);
    }
  }, [calculatedValues]);


  return (

    <main className="main-container">
      {user ? <Nav /> : null}
  
      {showTimerCalibration && (
        <div className="timer-container">
          <div className="timer">{formatTime(timerSecCalibration)}</div>
        </div>
      )}

      {showTimerNeurofeedback && (
        <div className="timer-container">
          <div className="timer">{formatTime(timerSecNeurofeedback)}</div>
        </div>
      )}
  
      {showAlphaValues && (<div className="brainwaves-container">
        <div className="brainwaves-label">Alpha Power (PO3 y PO4)</div>
        <div className={`brainwaves-score ${scoreClass}`}>{alphaChM.toFixed(2)}</div>
      </div>
      )}
  
      {alert && <div className="alert">{alert}</div>}

      {calculatedValues && (
        <div className="calculated-values-container">
          <div>- Valor máximo: {calculatedValues.maxValue.toFixed(3)}</div>
          <div>- Valor mínimo: {calculatedValues.minValue.toFixed(3)}</div>
         {/* <div>3) Total: {calculatedValues.total.toFixed(3)}</div>
          <div>4) Comienzo: {calculatedValues.start.toFixed(3)}</div>
          <div>5) Fin: {calculatedValues.end.toFixed(3)}</div>
          <div>6) Total 2: {calculatedValues.total2.toFixed(3)}</div>
          <div>7) Rango 1: {calculatedValues.range1.toFixed(3)}</div>
          <div>8) Rango 2: {calculatedValues.range2.toFixed(3)}</div>
          <div>9) Rango 3: {calculatedValues.range3.toFixed(3)}</div>
          <div>10) Rango 4: {calculatedValues.range4.toFixed(3)}</div> */} 
        </div>


      )}

      {/*
      {chartData && (
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      )}
      */}

      {!showPixelatedImage && !calibrationFinished &&(
        <div className="calm-image">
          <img src={calmPic} alt="Imagen Calma" />
          {showTimerCalibration && <div className="timer-message">Proceso de Imagen Fija</div>}
        </div>
      )}
  
      {showPixelatedImage && (
        <div className="calm-image">
         
        <img src={calmPic} alt="Imagen Calma" style={{ filter: `blur(${blurAmount}px)` }} />
         <div className="timer-message">Proceso de Imagen Pixelada</div>
        </div>
      )}
  
      {calibrationFinished && <div className="test-finished-text">Prueba finalizada</div>}
    </main>
  );
}


 
function appendDataToCSV(data, filename) {
  const csvData = data.map(row => Object.values(row).join(',')).join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;

  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  link.click();
}

function calculateValues(data) {
  const values = data.map(row => row.alpha);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const total = maxValue - minValue;
  const start = minValue + total * 0.1;
  const end = maxValue - total * 0.1;
  const total2 = end - start;
  const range1 = start + total2 * 0.25;
  const range2 = start + total2 * 0.5;
  const range3 = start + total2 * 0.75;
  const range4 = end;

  

  return {
    maxValue,
    minValue,
    total,
    start,
    end,
    total2,
    range1,
    range2,
    range3,
    range4
  };
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${formattedSeconds}`;
}

