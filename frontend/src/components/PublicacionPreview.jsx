import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser
} from "react-icons/fa";

import { formatearCLP } from "../utils/formatters.js";

/**
 * Vista previa local de una publicación.
 *
 * No guarda información ni consulta el backend. Solo representa los
 * valores actuales del formulario antes de presionar "Publicar producto".
 */
export default function PublicacionPreview({ formulario, nombreUsuario }) {
  const [estadoImagen, setEstadoImagen] = useState("vacia");

  useEffect(() => {
    setEstadoImagen(formulario.imagen ? "cargando" : "vacia");
  }, [formulario.imagen]);

  const precio = Number(formulario.precio) || 0;

  return (
    <section className="publication-preview-panel">
      <h2>Vista previa de tu publicación</h2>

      <article className="publication-preview-card">
        <div className="publication-preview-image">
          {formulario.imagen && (
            <img
              src={formulario.imagen}
              alt={formulario.nombre || "Vista previa del producto"}
              className={estadoImagen === "cargada" ? "is-visible" : ""}
              onLoad={() => setEstadoImagen("cargada")}
              onError={() => setEstadoImagen("error")}
            />
          )}

          {estadoImagen === "vacia" && (
            <div className="publication-preview-empty">
              Ingresa una URL de imagen para visualizar el producto.
            </div>
          )}

          {estadoImagen === "cargando" && (
            <div className="publication-preview-empty">
              Cargando imagen…
            </div>
          )}

          {estadoImagen === "error" && (
            <div className="publication-preview-error">
              La URL no pudo cargar una imagen pública.
            </div>
          )}
        </div>

        <div className="publication-preview-body">
          <span
            className={`publication-state-badge ${
              formulario.estado === "Usado" ? "is-used" : "is-new"
            }`}
          >
            {formulario.estado || "Nuevo"}
          </span>

          <span className="publication-preview-category">
            {formulario.categoria || "Selecciona una categoría"}
          </span>

          <h3>
            {formulario.nombre.trim() || "Título del producto"}
          </h3>

          <strong className="publication-preview-price">
            {formatearCLP(precio)} CLP
          </strong>

          <div className="publication-preview-shipping">
            <FaMapMarkerAlt />
            <span>
              {formulario.envio || "Selecciona el tipo de envío"}
            </span>
          </div>

          <p>
            {formulario.descripcion.trim() ||
              "La descripción de tu producto aparecerá en este espacio."}
          </p>

          <div className="publication-preview-meta">
            <span>
              <FaCalendarAlt />
              Publicado hoy
            </span>

            <span>
              <FaUser />
              Por {nombreUsuario || "Usuario"}
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
