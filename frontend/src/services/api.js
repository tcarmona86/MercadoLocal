import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mercadolocal_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("mercadolocal_token")) {
      localStorage.removeItem("mercadolocal_token");
      localStorage.removeItem("mercadolocal_usuario");
      window.dispatchEvent(new Event("mercadolocal:logout"));
    }
    return Promise.reject(error);
  }
);

export const getApiMessage = (error, fallback="Ocurrió un error inesperado.") =>
  error.response?.data?.mensaje || (error.code === "ECONNABORTED" ? "El servidor tardó demasiado en responder." : fallback);

export default api;
