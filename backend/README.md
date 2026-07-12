# MercadoLocal — Hito 3 Backend corregido

API REST modular con Node.js, Express y PostgreSQL. Incluye `pg`, `pg-format`, JWT,
bcrypt, CORS, middlewares y seis pruebas Supertest.

## Puesta en marcha

1. Ejecuta `database/00_crear_base_datos.sql` en la base `postgres`.
2. Conéctate a `mercadolocal_db` y ejecuta `database/schema.sql` y `database/seed.sql`.
3. Copia `.env.example` a `.env` y coloca tu contraseña PostgreSQL.
4. Ejecuta `npm install`, `npm run dev` y abre `http://localhost:3000/api/health`.
5. Ejecuta `npm test` para comprobar los códigos de estado.

Usuarios demo (contraseña bcrypt):
- `demo@mercadolocal.cl` / `12345678`
- `vendedor@mercadolocal.cl` / `12345678`

## Cumplimiento del Hito 3

- Proyecto npm y dependencias.
- API REST modular.
- PostgreSQL mediante `pg` y ordenamiento seguro con `pg-format`.
- Autenticación/autorización JWT.
- CORS configurable.
- Middleware JWT en perfil, direcciones, publicaciones, carrito y órdenes.
- Seis escenarios Supertest sobre más de cuatro rutas.
- Guía de Thunder Client.

## Preparación para producción

`src/config/db.js` acepta tanto variables locales como `DATABASE_URL` y SSL.
`CORS_ORIGINS` acepta varias URLs separadas por coma.
