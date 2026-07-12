import api from "./api.js";
export const obtenerCarritoApi = async () => (await api.get("/carrito")).data;
export const agregarCarritoApi = async (producto_id,cantidad) => (await api.post("/carrito",{producto_id,cantidad})).data;
export const cambiarCantidadApi = async (producto_id,cantidad) => (await api.put(`/carrito/${producto_id}`,{cantidad})).data;
export const eliminarCarritoApi = async (producto_id) => (await api.delete(`/carrito/${producto_id}`)).data;
export const vaciarCarritoApi = async () => (await api.delete("/carrito")).data;
export const crearOrdenApi = async (payload) => (await api.post("/ordenes",payload)).data;
export const obtenerOrdenesApi = async () => (await api.get("/ordenes")).data;
