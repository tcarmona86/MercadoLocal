/**
 * Archivo: src/main.jsx
 *
 * Funcionalidad:
 * Punto de entrada de React.
 * Aquí se monta la aplicación dentro del div #root definido en index.html.
 * También se importan Bootstrap y los estilos personalizados globales.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/marketplace.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
