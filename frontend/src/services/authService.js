import api from "./api.js";
export const registrarApi = async (payload) => (await api.post("/usuarios",payload)).data;
export const loginApi = async (payload) => (await api.post("/login",payload)).data;
export const perfilApi = async () => (await api.get("/perfil")).data;
export const actualizarPerfilApi = async (payload) => (await api.put("/perfil",payload)).data;
export const direccionesApi = async () => (await api.get("/direcciones")).data;
export const crearDireccionApi = async (payload) => (await api.post("/direcciones",payload)).data;
export const editarDireccionApi = async (id,payload) => (await api.put(`/direcciones/${id}`,payload)).data;
export const eliminarDireccionApi = async (id) => (await api.delete(`/direcciones/${id}`)).data;
