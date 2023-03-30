///Creado en First Node App. @neurosity/notion es la API de NotionJS. 
///AGREGAR SDK NEUROSITY A UN PROYECTO NODE>>AGREGAR DEPENDENCIAS A INDEX.JS. Sirve para importar bibliotecas (Node), agregando las dos dependencias (Notion (Neurosity) y env)
const { Notion } = require("@neurosity/notion");
require("dotenv").config();

//API ONDAS CEREBRALES (2). Extraccion CSV
const xlsx = require('xlsx'); //Asigna el objeto xlsx a la constante xlsx
const fs = require('fs'); //fs (file system): módulo integrado de Node.js. Permite leer y escribir archivos (trabaja con el S.O. con el que se ejecuta Node.js). 
//const data = [];


///AUTENTICACION>>OBTENER VARIABLES DEL ARCHIVO .ENV. Extrae el ID del dispositivo, el correo y la contraseña de las variables de entorno (env)
const deviceId = process.env.DEVICE_ID || ""; //OR***
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

///AUTENTICACION>>OBTENER VARIABLES DEL ARCHIVO .ENV. Sale de la aplicacion si los valores anteriores están en blanco
//Función:
const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (
      invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
  };
  verifyEnvs(email, password, deviceId);
  
  console.log(`${email} attempting to authenticate to ${deviceId}`);

  ///AUTENTICACION>>INSTALAR UN NOTION. Instanciamos un nuevo Notion usando el deviceID
  const notion = new Notion({
    deviceId
  });

  ///AUTENTICACION>>AGREGAR INICIO DE SESION ASÍNCRONO
  const main = async () => {
    await notion
      .login({
        email,
        password
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
    console.log("Logged in");

    ///API-CALM. Si BECALM es >0,3 imprime LOS DATOS
    ///ALT+MAY+A: Comentar codigo

    /* notion.calm().subscribe((calm) => {
      if (calm.probability > 0.7) {
        console.log(calm);
      }
    });
    */

    ///API-ONDAS CEREBRALES (1). 
    //"Row" parámetro de ondas cerebrales que genera 16 muestras de cada canal (8) apróximadamente cada 62.5ms. 
    ///0,25 muestras/s * 62,5 s = 16 muestras aprox.
    ///Épocas: cada grupo de 16 muestras. Se filtran en el S.O. del dispositivo. Propiedades del filtro: Noch (50-60Hz), Ancho de banda (1)/ Paso Banda con corte (2-45Hz)/ orden (2), tipo Butterworth
    
    const subscription = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
      console.log(brainwaves);
      
      //...Si a este código se le cambia "raw" por "rawUnfiltered" no se aplica filtro a la señal (escenarios avanzados)
      //...Si a este código se le cambia "raw" por "psd" genera épocas 4 veces/s. Cada etiqueta de frecuencia (p.e: alpha) contiene un valor FFT por canal. 8 canales y 64 valores/canal.
      //...Si a este código se le cambia "raw" por "powerByBand" genera épocas 4 veces/s. Cada etiqueta de frecuencia (p.e: alpha) contiene la potencia promedio por canal. 5 frecuencias y 8 canales/frecuencia: 
      /* {
        delta: [0.1, 4], // NOTE: Bandpass attenuates signal below 2 Hz
        theta: [4, 7.5],
        alpha: [7.5, 12.5],
        beta: [12.5, 30],
        gamma: [30, 100] // NOTE: Bandpass attenuates signal above 45 Hz
      } */
      
      //DATA
      const data = Object.values(brainwaves.data); //Data: Array creado con valores las Propiedades del Objeto brainwaves.data
      const rows = data[0].map((_, i) => Object.assign({}, ...data.map(d => ({ [Object.keys(d)[i]]: d[i] })))); //Rows: Array creado con el Array Data. Cada Objeto de Rows: fila, Cada Propiedad: columna. 



      const headers = ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4', 'Canal 5', 'Canal 6', 'Canal 7', 'Canal 8', 'Señales'];
      const merged = [headers, ...data];

      ///API-ONDAS CEREBRALES (2). Extracción del CSV
      const dataObj = {
            alpha: brainwaves.alpha && brainwaves.alpha.join(),
            beta: brainwaves.beta && brainwaves.beta.join(),
            delta: brainwaves.delta && brainwaves.delta.join(),
            gamma: brainwaves.gamma && brainwaves.gamma.join(),
            theta: brainwaves.theta && brainwaves.theta.join(),
            timestamp: brainwaves.timestamp // Agregamos el campo timestamp
          }
      data.push(dataObj); //Agrega el objeto dataObj al Array Data 1


      const timestamp = brainwaves.timestamp.toString();
      for (let prop in headers) {
        headers[prop] = timestamp;
      }

      

      //Este código termina los eventos a los 5 segundos
      setTimeout(() => {
        subscription.unsubscribe();

        ///API-ONDAS CEREBRALES (2):
        const workbook = xlsx.utils.book_new(); //Crea el libro de Excel
        const worksheet = xlsx.utils.json_to_sheet(merged);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Brainwaves'); //Agrega la hoja al libro
        const excelFileName = 'brainwaves.xlsx'; //Escribe el archivo Excel
        xlsx.writeFile(workbook, excelFileName, { bookType: 'xlsx', type: 'buffer' });
        console.log(`Los datos se han guardado en el archivo ${excelFileName}`);
      }, 1000); //1s
        

      //Se puede también usar el entrenamiento Kinesis de pensamientos (variante al código de arriba)
      //notion.kinesis("leftHandPinch").subscribe((intent) => {
        //console.log("Hello World!")
      //});

    });

    
    
  }
  
  main();



