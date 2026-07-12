# Pruebas con Thunder Client

1. `GET http://localhost:3000/api/health`
2. `POST http://localhost:3000/api/usuarios` con JSON de registro.
3. `POST http://localhost:3000/api/login`; copia el token.
4. En rutas privadas agrega `Authorization: Bearer TU_TOKEN`.
5. Prueba productos, publicaciones, direcciones, carrito y órdenes.
