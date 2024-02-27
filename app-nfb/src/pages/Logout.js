//GH
//SDK. La pagina de cierre de sesión es un componente React sin elementos DOM. logoutNotion() es un efecto secundario si la instancia Neurosity está presente.  Por último, redirige al suario a la ruta inicial tras cerrar sesión
import { useEffect } from "react";
import { navigate } from "@reach/router";

import { useNotion } from "../services/notion";

export function Logout() {
  const { logoutNotion } = useNotion();
    useEffect(() => {
    logoutNotion().then(() => {
      navigate("/");
    });
  }, [logoutNotion]);

  return null;
}