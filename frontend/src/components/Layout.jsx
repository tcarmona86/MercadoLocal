/**
 * Archivo: src/components/Layout.jsx
 *
 * Funcionalidad:
 * Plantilla visual reutilizable del sitio.
 * Renderiza NavbarPrincipal arriba, el contenido de la ruta actual mediante Outlet, y Footer abajo.
 *
 * Nota para el Hito 2:
 * Este archivo forma parte del frontend React. Algunas funciones usan localStorage
 * y datos mock para simular comportamiento que en el Hito 3 será reemplazado por backend.
 */

import { Outlet } from "react-router-dom";
import NavbarPrincipal from "./NavbarPrincipal.jsx";
import Footer from "./Footer.jsx";

function Layout() {
  return (
    <>
      <NavbarPrincipal />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
