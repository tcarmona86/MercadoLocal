import { Router } from "express";
import { borrarPublicacion, crearPublicacion, editarPublicacion, miPublicacion, misPublicaciones } from "../controllers/publicacionesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
export const publicacionesRouter=Router(); publicacionesRouter.post("/",authMiddleware,crearPublicacion);
export const misPublicacionesRouter=Router(); misPublicacionesRouter.use(authMiddleware); misPublicacionesRouter.get("/",misPublicaciones); misPublicacionesRouter.get("/:id",miPublicacion); misPublicacionesRouter.put("/:id",editarPublicacion); misPublicacionesRouter.delete("/:id",borrarPublicacion);
