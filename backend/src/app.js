import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import authRoutes from "./routes/authRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import direccionesRoutes from "./routes/direccionesRoutes.js";
import productosRoutes from "./routes/productosRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import { publicacionesRouter, misPublicacionesRouter } from "./routes/publicacionesRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import ordenesRoutes from "./routes/ordenesRoutes.js";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/errorMiddleware.js";

const app=express();
app.use(cors(corsOptions)); app.use(express.json({limit:"1mb"}));
app.get("/api/health",(req,res)=>res.json({ok:true,mensaje:"API MercadoLocal funcionando."}));
app.use("/api",authRoutes); app.use("/api/perfil",perfilRoutes); app.use("/api/direcciones",direccionesRoutes);
app.use("/api/productos",productosRoutes); app.use("/api/categorias",categoriasRoutes);
app.use("/api/publicaciones",publicacionesRouter); app.use("/api/mis-publicaciones",misPublicacionesRouter);
// Alias compatibles con el contrato del Hito 1.
app.use("/api/ventas",publicacionesRouter); app.use("/api/mis_ventas",misPublicacionesRouter);
app.use("/api/carrito",carritoRoutes); app.use("/api/carro",carritoRoutes); app.use("/api/ordenes",ordenesRoutes);
app.use(notFoundMiddleware); app.use(errorMiddleware);
export default app;
