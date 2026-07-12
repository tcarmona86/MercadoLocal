CREATE TABLE IF NOT EXISTS carritos (
 id SERIAL PRIMARY KEY, usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 estado VARCHAR(30) NOT NULL DEFAULT 'activo', fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_carrito_activo_usuario ON carritos(usuario_id) WHERE estado='activo';
