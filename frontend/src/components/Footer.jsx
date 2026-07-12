/**
 * Archivo: src/components/Footer.jsx
 *
 * Funcionalidad:
 * Footer principal del marketplace.
 * Muestra información del proyecto, navegación, categorías populares y contacto/soporte.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone } from "react-icons/fa";

function Footer() {
  return (
    <footer className="site-footer">
      <Container fluid="xl">
        <div className="footer-grid">
          <section>
            <div className="footer-brand">
              <span className="brand-icon small">M</span>
              <span>
                Mercado<span>Local</span>
              </span>
            </div>

            <p>
              La plataforma de comercio local más confiable de la región.
              Conecta, publica y adquiere productos con facilidad y seguridad.
            </p>
          </section>

          <section>
            <h2>Navegación</h2>
            <Link to="/">Inicio</Link>
            <Link to="/productos">Explorar Productos</Link>
            <Link to="/carrito">Carrito de Compras</Link>
            <Link to="/perfil">Mi Cuenta / Perfil</Link>
            <Link to="/publicar">Vender</Link>
          </section>

          <section>
            <h2>Categorías populares</h2>
            <Link to="/productos?categoria=Electrónica">Electrónica e Informática</Link>
            <Link to="/productos?categoria=Moda y Accesorios">Moda y Accesorios</Link>
            <Link to="/productos?categoria=Hogar y Decoración">Hogar y Decoración</Link>
            <Link to="/productos?categoria=Deportes y Outdoor">Deportes y Outdoor</Link>
          </section>

          <section>
            <h2>Contacto & Soporte</h2>
            <p className="footer-contact">
              <FaEnvelope /> soporte@mercadolocal.cl
            </p>
            <p className="footer-contact">
              <FaPhone /> +56 9 1234 5678
            </p>
            <Link to="/publicar" className="footer-cta">
              Publicar un artículo ahora →
            </Link>
          </section>
        </div>

        <div className="footer-bottom footer-bottom-simple">
          <span>© 2026 MercadoLocal Inc. Todos los derechos reservados.</span>
          <span>Chile</span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
