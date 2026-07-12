import { Router } from "express";
import { editarPerfil, obtenerPerfil } from "../controllers/perfilController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router=Router(); router.use(authMiddleware); router.get("/",obtenerPerfil); router.put("/",editarPerfil); export default router;
