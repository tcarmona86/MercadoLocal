# Endpoints

Públicos: `GET /api/health`, `POST /api/usuarios`, `POST /api/login`,
`GET /api/productos`, `GET /api/productos/:id`, `GET /api/categorias`.

Privados con `Authorization: Bearer TOKEN`:
`GET/PUT /api/perfil`; CRUD `/api/direcciones`; `POST /api/publicaciones`;
CRUD `/api/mis-publicaciones`; CRUD `/api/carrito`; `POST/GET /api/ordenes`.

Ordenamiento: `/api/productos?order_by=precio_ASC` o `precio_DESC`.
