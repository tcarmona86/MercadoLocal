# MercadoLocal — Frontend Hito 4

Cliente React + Vite integrado con la API Express/PostgreSQL.

## Variables

Copia `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecución

```bash
npm install
npm run dev
npm run build
```

En producción configura `VITE_API_URL` con la URL pública del backend.
El archivo `netlify.toml` incluye el redirect necesario para React Router.
