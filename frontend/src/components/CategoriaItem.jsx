/**
 * Archivo: src/components/CategoriaItem.jsx
 *
 * Funcionalidad:
 * Componente reutilizable para mostrar una categoría en el Home.
 * Cada categoría tiene un ícono y al hacer clic filtra productos usando query params en la URL.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { FaCouch, FaDumbbell, FaMobileAlt, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

const iconos = {
  "Electrónica": FaMobileAlt,
  "Hogar y Decoración": FaCouch,
  "Deportes y Outdoor": FaDumbbell,
  "Moda y Accesorios": FaShoppingBag
};

function CategoriaItem({ nombre }) {
  const Icono = iconos[nombre] || FaMobileAlt;

  return (
    <Link
      to={`/productos?categoria=${encodeURIComponent(nombre)}`}
      className="category-item"
    >
      <div className="category-icon-circle">
        <Icono />
      </div>

      <span>{nombre}</span>
    </Link>
  );
}

export default CategoriaItem;
