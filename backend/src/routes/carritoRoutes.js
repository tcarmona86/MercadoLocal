import { Router } from "express";
import { agregarProducto, cambiarCantidad, obtenerCarrito, quitarProducto, vaciarCarrito } from "../controllers/carritoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router=Router(); router.use(authMiddleware); router.get("/",obtenerCarrito); router.post("/",agregarProducto); router.put("/:producto_id",cambiarCantidad); router.delete("/:producto_id",quitarProducto); router.delete("/",vaciarCarrito); export default router;
