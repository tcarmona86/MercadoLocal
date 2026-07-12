/**
 * Archivo: vite.config.js
 *
 * Funcionalidad:
 * Configuración de Vite.
 * Activa el plugin oficial de React para compilar JSX y servir el proyecto en desarrollo.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
