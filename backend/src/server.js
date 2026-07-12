import dotenv from "dotenv"; import app from "./app.js"; import { verificarConexion } from "./config/db.js";
dotenv.config(); const PORT=process.env.PORT || 3000;
const start=async()=>{try{await verificarConexion(); console.log("PostgreSQL conectado."); app.listen(PORT,()=>console.log(`Servidor en http://localhost:${PORT}`));}catch(error){console.error("No fue posible conectar con PostgreSQL:",error.message);process.exit(1);}}; start();
