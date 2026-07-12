import { useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaCartPlus, FaMapMarkerAlt } from "react-icons/fa";

import useCart from "../hooks/useCart.js";
import { formatearCLP } from "../utils/formatters.js";

/**
 * Tarjeta reutilizable para mostrar un producto.
 *
 * No utiliza una imagen predeterminada. La URL de la imagen debe venir
 * correctamente desde PostgreSQL a través del backend.
 */
export default function ProductCard(props) {
  const {
    id,
    nombre,
    precio,
    categoria,
    imagen,
    estado,
    envio
  } = props;

  const { agregarProducto } = useCart();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  /**
   * Agrega una unidad del producto al carrito.
   * Si el usuario no está autenticado, lo redirige al login.
   */
  const agregar = async () => {
    const resultado = await agregarProducto(props, 1);

    if (resultado.requiereLogin) {
      navigate("/login", {
        state: {
          from: `/producto/${id}`,
          mensaje: resultado.mensaje
        }
      });
      return;
    }

    setMensaje(
      resultado.ok
        ? "Producto agregado al carrito."
        : resultado.mensaje
    );
  };

  return (
    <Card className="product-card h-100">
      <div className="product-image-wrapper">
        <Card.Img
          variant="top"
          src={imagen}
          alt={nombre}
          loading="lazy"
        />

        {estado && (
          <span className="condition-badge">
            {estado}
          </span>
        )}
      </div>

      <Card.Body>
        <span className="product-category">
          {categoria}
        </span>

        <Card.Title>
          {nombre}
        </Card.Title>

        <div className="product-shipping">
          <FaMapMarkerAlt />
          <span>{envio}</span>
        </div>

        <strong className="product-price">
          {formatearCLP(precio)}
        </strong>

        {mensaje && (
          <Alert variant="info" className="py-1 small">
            {mensaje}
          </Alert>
        )}

        <div className="product-actions">
          <Button
            as={Link}
            to={`/producto/${id}`}
            variant="outline-primary"
          >
            Ver detalle
          </Button>

          <Button
            type="button"
            onClick={agregar}
            className="primary-action"
          >
            <FaCartPlus />
            Agregar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
