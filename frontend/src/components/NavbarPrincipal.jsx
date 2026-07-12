/**
 * Archivo: src/components/NavbarPrincipal.jsx
 *
 * Funcionalidad:
 * Header principal del marketplace.
 * Incluye logo, botón vender, buscador, carrito, menú de perfil, inicio/cierre de sesión y navegación hacia rutas principales.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { useContext, useState } from "react";
import { Container, Form, Nav, Navbar, Button, Badge, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaRegUser,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTag
} from "react-icons/fa";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function NavbarPrincipal() {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const { cantidadTotal } = useContext(CartContext);
  const { usuario, autenticado, cerrarSesion } = useContext(AuthContext);

  const buscarProductos = (evento) => {
    evento.preventDefault();

    if (busqueda.trim() === "") {
      navigate("/productos");
      return;
    }

    navigate(`/productos?buscar=${encodeURIComponent(busqueda)}`);
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="main-header sticky-top">
      <Container fluid="xl" className="header-container">
        <Navbar.Brand as={Link} to="/" className="brand-area">
          <span className="brand-icon">M</span>
          <span className="brand-name">
            Mercado<span>Local</span>
          </span>
        </Navbar.Brand>

        <Button as={Link} to="/publicar" className="sell-button d-none d-lg-inline-flex">
          <FaTag />
          Vende
        </Button>

        <Navbar.Toggle aria-controls="navbar-marketplace" className="menu-toggle" />

        <Navbar.Collapse id="navbar-marketplace" className="navbar-content">
          <Form className="search-form" onSubmit={buscarProductos}>
            <Form.Control
              type="search"
              placeholder="Busca productos, marcas y más..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <button type="submit" aria-label="Buscar">
              <FaSearch />
            </button>
          </Form>

          <Nav className="header-actions">
            <Nav.Link as={Link} to="/carrito" className="header-icon-button">
              <FaShoppingCart />
              {cantidadTotal > 0 && (
                <Badge bg="danger" pill className="cart-count">
                  {cantidadTotal}
                </Badge>
              )}
              <span className="d-lg-none ms-2">Carrito</span>
            </Nav.Link>

            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle className="user-toggle">
                <span className="user-initial">
                  {autenticado && usuario ? usuario.nombre.charAt(0) : <FaRegUser />}
                </span>
                <span className="user-name">
                  {autenticado && usuario ? usuario.nombre : "Perfil"}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {autenticado ? (
                  <>
                    <Dropdown.Item as={Link} to="/perfil">
                      <FaRegUser className="me-2" />
                      Mi perfil
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/publicar">
                      <FaBoxOpen className="me-2" />
                      Publicar producto
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={manejarCerrarSesion}>
                      <FaSignOutAlt className="me-2" />
                      Cerrar sesión
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/login">
                      <FaSignInAlt className="me-2" />
                      Iniciar sesión
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/registro">
                      <FaRegUser className="me-2" />
                      Crear cuenta
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarPrincipal;
