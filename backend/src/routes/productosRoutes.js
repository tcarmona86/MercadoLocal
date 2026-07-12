import { Router } from "express"; import { obtenerProducto, obtenerProductos } from "../controllers/productosController.js";
const router=Router(); router.get("/",obtenerProductos); router.get("/:id",obtenerProducto); export default router;
