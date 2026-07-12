export const notFoundMiddleware = (req, res) => {
  res.status(404).json({ ok: false, mensaje: "Ruta no encontrada." });
};

export const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({ ok: false, mensaje: "El registro ya existe." });
  }

  if (["23503", "23514", "22P02"].includes(error.code)) {
    return res.status(400).json({ ok: false, mensaje: "Los datos enviados no son válidos." });
  }

  res.status(error.status || 500).json({
    ok: false,
    mensaje: error.status ? error.message : "Error interno del servidor."
  });
};
