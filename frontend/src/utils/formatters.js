/**
 * Archivo: src/utils/formatters.js
 *
 * Funcionalidad:
 * Funciones auxiliares reutilizables.
 * formatearCLP muestra valores como moneda chilena y limpiarPrecioCLP limpia entradas para guardar solo números.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

export const formatearCLP = (valor) => {
  const numero = Number(valor) || 0;

  return numero.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
};

export const limpiarPrecioCLP = (valor) => {
  return String(valor).replace(/[^0-9]/g, "");
};
