//GH
//AUTENTICACIÓN. El objetivo de esta página es mostrar el formulario de inicio de sesión (src/components/LoginForm.js).
//La función setError agrega una validación del formulario.
//La ejecución de la función de login() es un Efecto Secundario que sincroniza email y password con los accesorios recibidos en la pagina. Llamamos a esta función si no hay una sesión de autenticación, si hay una instancia de Neurosity en el estado y si el usuario ha enviado un email y contraseña
//USER: objeto que contiene la sesión de autenticación de SDK Neurosity
import React, { useState, useEffect } from "react"; //Autenticación
import { navigate } from "@reach/router";
import useEffectOnce from "react-use/lib/useEffectOnce";

import { LoginForm } from "../components/LoginForm"; //Autenticación
import { Footer } from "../components/Footer";

import { notion, useNotion } from "../services/notion";

export function Login() {
  const { user, lastSelectedDeviceId, setSelectedDevice } = useNotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffectOnce(() => {
    if (user) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (email && password) {
      login();
    }

    async function login() {
      setIsLoggingIn(true);
      const auth = await notion.login({ email, password }).catch((error) => {
          setError(error.message);
        });

      if (auth) {
        resetForm();

        if (lastSelectedDeviceId) {
          navigate("/");
        } else {
          navigate("/devices");
        }
      }
      setIsLoggingIn(false);
    }
  }, [email, password, setError, lastSelectedDeviceId, setSelectedDevice]);

  //Autenticación
  function onLogin({ email, password }) {
    if (email && password) {
      setError("");
      setEmail(email);
      setPassword(password);
    } else {
      setError("Please fill the form");
    }
  }

  function resetForm() {
    setError("");
    setEmail("");
    setPassword("");
  }

  //Autenticación
  return (
    <main className="main-container">
      <LoginForm onLogin={onLogin} error={error} loading={isLoggingIn} footerComponent={<Footer />}
      />
    </main>
  );
}