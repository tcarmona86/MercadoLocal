import { Router } from "express"; import { obtenerCategorias } from "../controllers/categoriasController.js";
const router=Router(); router.get("/",obtenerCategorias); export default router;
