/**
 * Archivo: src/components/TrustBar.jsx
 *
 * Funcionalidad:
 * Franja informativa de confianza.
 * Muestra mensajes de compra segura, envíos rápidos y garantía de devolución.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { Container } from "react-bootstrap";
import { FaShieldAlt, FaShippingFast, FaUndoAlt } from "react-icons/fa";

function TrustBar() {
  const items = [
    {
      icon: FaShieldAlt,
      title: "Compra 100% Segura",
      text: "Tus datos y pagos están protegidos con encriptación avanzada."
    },
    {
      icon: FaShippingFast,
      title: "Envíos Rápidos",
      text: "Recibe tus productos en la puerta de tu casa."
    },
    {
      icon: FaUndoAlt,
      title: "Garantía de Devolución",
      text: "Devuelve el producto de forma sencilla dentro de los primeros 10 días."
    }
  ];

  return (
    <section className="trust-section">
      <Container fluid="xl">
        <div className="trust-grid">
          {items.map(({ icon: Icono, title, text }) => (
            <article className="trust-item" key={title}>
              <div className="trust-icon">
                <Icono />
              </div>

              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TrustBar;
