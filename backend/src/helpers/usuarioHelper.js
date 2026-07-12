export const usuarioPublico = (usuario, direcciones = []) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  apellido: usuario.apellido || "",
  rut: usuario.rut || "",
  email: usuario.email,
  foto: usuario.foto || "",
  telefono: usuario.telefono || "",
  direccion: usuario.direccion || "",
  comuna: usuario.comuna || "",
  region: usuario.region || "",
  rol: usuario.rol,
  activo: usuario.activo,
  fecha_creacion: usuario.fecha_creacion,
  direcciones
});
