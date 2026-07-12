/**
 * Archivo: src/pages/NotFound.jsx
 *
 * Funcionalidad:
 * Página 404 para rutas inexistentes.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container fluid="xl" className="page-container">
      <section className="auth-card">
        <h1>404</h1>
        <p>Página no encontrada.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    </Container>
  );
}

export default NotFound;
