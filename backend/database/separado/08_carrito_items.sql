CREATE TABLE IF NOT EXISTS carrito_items (
 id SERIAL PRIMARY KEY, carrito_id INTEGER NOT NULL REFERENCES carritos(id) ON DELETE CASCADE,
 producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE, cantidad INTEGER NOT NULL CHECK(cantidad>0),
 precio_unitario NUMERIC(12,2) NOT NULL CHECK(precio_unitario>0), fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(carrito_id,producto_id)
);
