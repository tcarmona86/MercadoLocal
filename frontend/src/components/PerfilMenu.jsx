import { Button } from "react-bootstrap";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPlusCircle,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

/**
 * Menú lateral compartido por Perfil y Nueva publicación.
 *
 * "Vende" y "Nueva publicación" usan la misma ruta /publicar,
 * por lo que no existe un formulario duplicado.
 */
export default function PerfilMenu({
  seccionActiva = "datos",
  onSelect
}) {
  const { cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const seleccionar = (seccion) => {
    if (seccion === "nueva") {
      navigate("/publicar");
      return;
    }

    if (typeof onSelect === "function") {
      onSelect(seccion);
      return;
    }

    navigate("/perfil", {
      state: {
        seccion
      }
    });
  };

  const salir = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <aside className="profile-sidebar">
      <Button
        type="button"
        className={seccionActiva === "datos" ? "active" : ""}
        onClick={() => seleccionar("datos")}
      >
        <FaUser />
        Datos personales
      </Button>

      <Button
        type="button"
        className={seccionActiva === "direcciones" ? "active" : ""}
        onClick={() => seleccionar("direcciones")}
      >
        <FaMapMarkerAlt />
        Direcciones
      </Button>

      <Button
        type="button"
        className={seccionActiva === "publicaciones" ? "active" : ""}
        onClick={() => seleccionar("publicaciones")}
      >
        <FaBoxOpen />
        Mis publicaciones
      </Button>

      <Button
        type="button"
        className={seccionActiva === "nueva" ? "active" : ""}
        onClick={() => seleccionar("nueva")}
      >
        <FaPlusCircle />
        Nueva publicación
      </Button>

      <Button
        type="button"
        className="logout"
        onClick={salir}
      >
        <FaSignOutAlt />
        Cerrar sesión
      </Button>
    </aside>
  );
}
