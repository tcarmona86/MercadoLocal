import api from "./api.js";
export const obtenerProductos = async (params={}) => (await api.get("/productos",{params})).data;
export const obtenerProductoPorId = async (id) => (await api.get(`/productos/${id}`)).data;
export const obtenerCategorias = async () => (await api.get("/categorias")).data;
export const crearPublicacionApi = async (payload) => (await api.post("/publicaciones",payload)).data;
export const misPublicacionesApi = async () => (await api.get("/mis-publicaciones")).data;
export const editarPublicacionApi = async (id,payload) => (await api.put(`/mis-publicaciones/${id}`,payload)).data;
export const eliminarPublicacionApi = async (id) => (await api.delete(`/mis-publicaciones/${id}`)).data;
