//GH
//ESTADO
import React, { useEffect } from "react"; //Estado
import { Router, navigate } from "@reach/router"; //Estado

import { ProvideNotion } from "./services/notion";
import { Devices } from "./pages/Devices";
import { Loading } from "./components/Loading";
import { Login } from "./pages/Login"; //Estado
import { Logout } from "./pages/Logout"; //SDK
import { Calm } from "./pages/Calm"; //Calm

import { useNotion } from "./services/notion";


export function App() {
  return (
    <ProvideNotion>
      <Routes />
    </ProvideNotion>
  );
}

function Routes() {
  const { user, loadingUser } = useNotion();

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    }
  }, [user, loadingUser]);

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <Router>
      <Calm path="/" /> 
      <Devices path="/devices" />
      <Login path="/login" />
      <Logout path="/logout" />
    </Router>
  );
}
