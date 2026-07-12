import { Router } from "express"; import { crearOrden, obtenerOrdenes, obtenerOrdenPorId } from "../controllers/ordenesController.js"; import { authMiddleware } from "../middlewares/authMiddleware.js";
const router=Router(); router.use(authMiddleware); router.post("/",crearOrden); router.get("/",obtenerOrdenes); router.get("/:id",obtenerOrdenPorId); export default router;
