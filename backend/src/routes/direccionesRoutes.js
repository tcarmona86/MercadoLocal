import { Router } from "express";
import { actualizarDireccion, agregarDireccion, eliminarDireccion, obtenerDirecciones } from "../controllers/direccionesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router=Router(); router.use(authMiddleware); router.get("/",obtenerDirecciones); router.post("/",agregarDireccion); router.put("/:id",actualizarDireccion); router.delete("/:id",eliminarDireccion); export default router;
