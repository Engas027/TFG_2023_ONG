//GH
//ESTADO. La instancia de Neurosity y User se sincronizan con un Efecto Secundario creando una suscripción a la API de Calm
import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";
import "./Brainwaves.css";

//CODIGO 3
function gaussRandom() {
  var u = 0, v = 0;
  while (u === 0) u = Math.random(); //Construye una variable uniformemente distribuida en (0,1]
  while (v === 0) v = Math.random(); //Construye otra variable uniformemente distribuida en (0,1]
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}


export function Brainwaves() {
  const { user } = useNotion();
  const [brainwaves, setBrainwaves] = useState(0);
  const [alert, setAlert] = useState("");
  const [testFinished, setTestFinished] = useState(false);
  const [scoreClass, setScoreClass] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showSong, setShowSong] = useState(false);
/*   const [maskIntensity, setMaskIntensity] = useState(0);
  const [maskOpacity, setMaskOpacity] = useState(0.3); Estas eran para la máscara img-mask.png: CODIGO 1*/
  const [noiseMatrix, setNoiseMatrix] = useState(null); /* no muestra imagen, intento fallido: CODIGO 3 */
  const [maskedImage, setMaskedImage] = useState(null); /* no muestra imagen, intento fallido: CODIGO 3 */

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  //CODIGO 3
  useEffect(() => {
    const newNoiseMatrix = [];
    for (let i = 0; i < 400; i++) {
      newNoiseMatrix.push([]);
      for (let j = 0; j < 300; j++) {
        newNoiseMatrix[i].push(gaussRandom() * brainwaves); // Multiplicamos por el valor de brainwaves para que la intensidad de la máscara dependa de ese valor
      }
    }
    setNoiseMatrix(newNoiseMatrix);
  }, [brainwaves]);

  useEffect(() => {
    if (noiseMatrix) {
      const maskedImage = document.createElement("canvas");
      maskedImage.width = 400;
      maskedImage.height = 300;
      const ctx = maskedImage.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, maskedImage.width, maskedImage.height);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const row = Math.floor(i / 4 / maskedImage.width);
          const col = (i / 4) % maskedImage.width;
          pixels[i] += noiseMatrix[row][col];
          pixels[i + 1] += noiseMatrix[row][col];
          pixels[i + 2] += noiseMatrix[row][col];
          pixels[i + 3] = 255; // alpha channel set to opaque
        }
        ctx.putImageData(imageData, 0, 0);
        setMaskedImage(maskedImage.toDataURL());
      };
      img.src = "https://picsum.photos/400/300"; // Cambiar la fuente de la imagen por la que se quiere utilizar para la máscara
    }
  }, [noiseMatrix]); //FIN CODIGO 3
  

  useEffect(() => {
    let subscription;
  
    if (user) {
      subscription = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
        const alphaCh1 = brainwaves.data.alpha[1];
        const alphaCh3 = brainwaves.data.alpha[3];
        const alphaChM = (alphaCh1 + alphaCh3) / 2;
  
        setBrainwaves(alphaChM);
  
        console.log(`Valor Medio Alpha (C1 y C3): ${alphaChM}`);
  
        if (alphaChM > 10) {
          setAlert("Te duermes coleguita");
          setTimeout(() => {
            setAlert("");
          }, 2000);
          setScoreClass("score-red");
          setShowSong(true);
        } else {
          setAlert("");
          setScoreClass("score-green");
          setShowImage(true);
        }
        
      });
  
      return () => {
        setTimeout(() => {
          subscription.unsubscribe();
          setTestFinished(true);
        }, 25000);
      };
    }
  }, [user]);

  return (
    <main className="main-container">
      {user ? <Nav /> : null}
      <div className="brainwaves-container">
        <div className="brainwaves-label">PowerByBand-Alpha (C1 y C3)</div>
        <div className={`brainwaves-score ${scoreClass}`}>{brainwaves.toFixed(2)}</div>
      </div>
      {alert && <div className="alert">{alert}</div>}
      {testFinished && <div className="test-finished-text">Prueba finalizada</div>}
      {showImage && (
        <div className="media-container">
          {/* <div className="media-mask" style={{ opacity: maskOpacity }}></div>  : CODIGO 1*/}
          <img src="https://picsum.photos/400/300" alt="Random" /> 
        </div>
      )}
      {showSong && (
        <div className="media-container">
          <audio controls>
            <source src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </main>
  );
      }  
