# MercadoLocal — Hito 4

Aplicación web tipo marketplace desarrollada con React, Node.js, Express y PostgreSQL.

En este hito se realizó la integración completa entre el frontend, el backend y la base de datos. El sistema permite registrar usuarios, iniciar sesión, administrar perfiles y direcciones, publicar productos, gestionar un carrito de compras, crear órdenes y mantener la información persistida en PostgreSQL.

---

## Integrantes

- Tere Carmona
- Pablo Quincha
- David Gili

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router
- React Bootstrap
- Axios
- Context API
- CSS

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- CORS
- pg
- pg-format
- Jest
- Supertest

---

## Requisitos previos

Antes de ejecutar el proyecto debes tener instalado:

- Node.js
- npm
- PostgreSQL
- pgAdmin
- Git, opcional

---

## Ejecución local

### 1. Crear la base de datos

Desde pgAdmin crea una base de datos llamada:

mercadolocal_db

Luego abre Query Tool y ejecuta los archivos en el siguiente orden:

- backend/database/schema.sql
- backend/database/seed.sql

El archivo schema.sql crea las tablas, relaciones, claves foráneas y restricciones de la base de datos.

El archivo seed.sql inserta usuarios demo, categorías, productos, imágenes y otros datos iniciales necesarios para probar la aplicación.

---

### 2. Configurar el backend

Copia el archivo:

backend/.env.example

y crea un archivo nuevo llamado:

backend/.env

Configura las variables de entorno con los datos de tu PostgreSQL local:

PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mercadolocal_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES

DB_SSL=false

JWT_SECRET=TU_CLAVE_SECRETA
JWT_EXPIRES_IN=2h

CORS_ORIGINS=http://localhost:5173

IMPORTANTE:

El archivo .env contiene información privada, por lo tanto no debe subirse al repositorio.

El archivo .env.example sí puede incluirse porque solo contiene ejemplos de las variables necesarias.

---

### 3. Configurar el frontend

Copia el archivo:

frontend/.env.example

y crea un archivo nuevo llamado:

frontend/.env

Configura la URL local del backend:

VITE_API_URL=http://localhost:3000/api

---

### 4. Instalar y ejecutar el backend

Abre una terminal y ejecuta:

cd backend
npm install
npm run dev

El backend quedará disponible en:

http://localhost:3000

Puedes comprobar su funcionamiento desde:

http://localhost:3000/api/health

Si la API funciona correctamente, debería responder con un estado exitoso.

---

### 5. Instalar y ejecutar el frontend

Abre una segunda terminal y ejecuta:

cd frontend
npm install
npm run dev

El frontend quedará disponible normalmente en:

http://localhost:5173

El frontend y el backend deben mantenerse ejecutándose al mismo tiempo.

---

### 6. Ejecutar las pruebas del backend

Para ejecutar las pruebas automáticas con Jest y Supertest:

cd backend
npm test

Las pruebas verifican rutas públicas y protegidas, validaciones y diferentes códigos de estado HTTP.

---

## Despliegue en producción si quieres ocupar estos Host gratuitos 

### Backend y PostgreSQL en Render

El backend y la base de datos PostgreSQL pueden desplegarse en Render.

Puedes utilizar el archivo render.yaml incluido en el proyecto o crear los servicios manualmente desde el panel de Render.

Antes de publicar, revisa la ubicación real del archivo:

render.yaml

o:

backend/render.yaml

En el backend deben configurarse variables de entorno similares a estas:

NODE_ENV=production
DATABASE_URL=URL_DE_POSTGRESQL_RENDER
JWT_SECRET=TU_CLAVE_SECRETA_DE_PRODUCCION
JWT_EXPIRES_IN=2h
CORS_ORIGINS=https://TU-SITIO.netlify.app

En la base de datos PostgreSQL de producción se deben ejecutar:

backend/database/schema.sql
backend/database/seed.sql

La conexión de producción utiliza DATABASE_URL y SSL.

---

### Frontend en Netlify: Despliegue en producción si quieres ocupar Netlify 

Configuración recomendada:

Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist

En las variables de entorno de Netlify configura:

VITE_API_URL=https://TU-BACKEND.onrender.com/api

Después de modificar VITE_API_URL debes realizar un nuevo despliegue del frontend.

En Render, la variable CORS_ORIGINS debe contener la URL exacta del sitio publicado en Netlify:

CORS_ORIGINS=https://TU-SITIO.netlify.app

El proyecto incluye configuración de redirección SPA para que las rutas de React funcionen correctamente al recargar la página.

---

## Funcionalidades integradas en el Hito 4

- Integración completa entre frontend, backend y PostgreSQL.
- Productos obtenidos desde la API.
- Eliminación del uso de productos mock.
- Categorías obtenidas desde la base de datos.
- Ordenamiento por menor precio.
- Ordenamiento por mayor precio.
- Registro de usuarios.
- Inicio de sesión.
- Contraseñas cifradas mediante bcrypt.
- Autenticación y autorización mediante JWT.
- Persistencia del token en localStorage.
- Restauración de sesión mediante /api/perfil.
- Perfil de usuario.
- Actualización de datos personales.
- CRUD de direcciones.
- CRUD de publicaciones.
- Creación de publicaciones.
- Edición de publicaciones propias.
- Eliminación de publicaciones propias.
- Vista previa de publicación.
- Carrito disponible únicamente para usuarios autenticados.
- Carrito persistido en PostgreSQL.
- Agregar productos al carrito.
- Modificar cantidades.
- Eliminar productos del carrito.
- Validación de stock.
- Cálculo de subtotales.
- Cálculo del total de compra.
- Creación de órdenes desde el carrito.
- Registro de productos comprados en orden_items.
- Descuento automático de stock.
- Registro básico de pago.
- Manejo de estados de carga.
- Manejo de errores.
- Validaciones en frontend.
- Validaciones en backend.
- Configuración de DATABASE_URL.
- Configuración SSL.
- Configuración CORS.
- Redirecciones SPA.
- Diseño responsive.

---

## Flujo general de la aplicación

Frontend React
      ↓
Contextos y servicios Axios
      ↓
API REST con Express
      ↓
    Rutas
      ↓
 Middlewares
      ↓
Controladores
      ↓
   Modelos
      ↓
PostgreSQL

Las rutas protegidas requieren un token JWT válido enviado en la cabecera:

Authorization: Bearer TOKEN

---

## Estado del proyecto

Hito 4 integrado y preparado para ejecución local, pruebas y despliegue en producción.

El proyecto conecta correctamente:

- Frontend React
- Backend Express
- Base de datos PostgreSQL
- Autenticación JWT
- Carrito
- Publicaciones
- Direcciones
- Órdenes
- Pagos

