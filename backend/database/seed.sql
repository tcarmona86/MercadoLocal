INSERT INTO usuarios (nombre,apellido,rut,email,password_hash,telefono,direccion,comuna,region,rol)
VALUES ('Usuario','Demo','11.111.111-1','demo@mercadolocal.cl','$2b$10$mS4TO9GFk5b1hZdWAOQVn.1GYk844UzbZiB83kFTBRWxnIRUboMNm','+56 9 1111 1111','Av. Demo 123','Santiago','Región Metropolitana','cliente'),
('Vendedor','Demo','22.222.222-2','vendedor@mercadolocal.cl','$2b$10$mS4TO9GFk5b1hZdWAOQVn.1GYk844UzbZiB83kFTBRWxnIRUboMNm','+56 9 2222 2222','Av. Tienda 456','Providencia','Región Metropolitana','cliente')
ON CONFLICT(email) DO NOTHING;
INSERT INTO direcciones (usuario_id,direccion,comuna,region,es_principal)
SELECT id,direccion,comuna,region,TRUE FROM usuarios u WHERE email='demo@mercadolocal.cl'
AND NOT EXISTS (SELECT 1 FROM direcciones d WHERE d.usuario_id=u.id);
INSERT INTO vendedores (usuario_id,nombre_tienda,descripcion)
SELECT id,'Tienda Demo','Vendedor de productos de demostración.' FROM usuarios WHERE email='vendedor@mercadolocal.cl'
ON CONFLICT(usuario_id) DO NOTHING;
INSERT INTO categorias (nombre,descripcion,icono,imagen) VALUES
('Electrónica','Tecnología y accesorios.','FaMobileAlt','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=900'),
('Hogar y Decoración','Productos para tu hogar.','FaCouch','https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=900'),
('Deportes y Outdoor','Artículos deportivos.','FaDumbbell','https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=900'),
('Moda y Accesorios','Ropa y accesorios.','FaShoppingBag','https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=900')
ON CONFLICT(nombre) DO NOTHING;

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Audífonos Inalámbricos SoundPro','Sonido estéreo premium con cancelación de ruido y batería de larga duración.',24990,15,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Electrónica'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Audífonos Inalámbricos SoundPro') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900',1 FROM productos p WHERE nombre='Audífonos Inalámbricos SoundPro'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Notebook Lenovo IdeaPad 3','Notebook ligera para estudios, trabajo remoto y navegación diaria.',549990,7,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Electrónica'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Notebook Lenovo IdeaPad 3') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=900',1 FROM productos p WHERE nombre='Notebook Lenovo IdeaPad 3'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Smartwatch X7 Pro','Monitorea actividad física y recibe notificaciones.',59990,12,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Electrónica'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Smartwatch X7 Pro') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900',1 FROM productos p WHERE nombre='Smartwatch X7 Pro'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Mochila Urbana Antirrobo','Diseño resistente con compartimiento para notebook.',29990,20,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Moda y Accesorios'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Mochila Urbana Antirrobo') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900',1 FROM productos p WHERE nombre='Mochila Urbana Antirrobo'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Silla Gamer Ergonómica','Silla cómoda para largas jornadas.',129990,5,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Hogar y Decoración'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Silla Gamer Ergonómica') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=900',1 FROM productos p WHERE nombre='Silla Gamer Ergonómica'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Zapatillas Urbanas Classic White','Zapatillas cómodas y versátiles.',39990,14,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Moda y Accesorios'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Zapatillas Urbanas Classic White') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900',1 FROM productos p WHERE nombre='Zapatillas Urbanas Classic White'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Lámpara de Escritorio LED','Iluminación regulable para escritorio.',18990,10,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Hogar y Decoración'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Lámpara de Escritorio LED') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900',1 FROM productos p WHERE nombre='Lámpara de Escritorio LED'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Set Mancuernas Ajustables','Set práctico para entrenamiento en casa.',45990,9,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Deportes y Outdoor'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Set Mancuernas Ajustables') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=900',1 FROM productos p WHERE nombre='Set Mancuernas Ajustables'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Teclado Mecánico RGB','Teclado compacto con iluminación RGB.',34990,10,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Electrónica'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Teclado Mecánico RGB') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=900',1 FROM productos p WHERE nombre='Teclado Mecánico RGB'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Mouse Gamer Inalámbrico','Mouse preciso y liviano.',21990,10,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Electrónica'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Mouse Gamer Inalámbrico') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=900',1 FROM productos p WHERE nombre='Mouse Gamer Inalámbrico'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Chaqueta Outdoor Impermeable','Chaqueta resistente al agua.',49990,10,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Moda y Accesorios'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Chaqueta Outdoor Impermeable') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=900',1 FROM productos p WHERE nombre='Chaqueta Outdoor Impermeable'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);

INSERT INTO productos (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
SELECT v.id,c.id,'Mesa de Centro Nórdica','Mesa moderna de diseño minimalista.',79990,10,'Nuevo','Envío rápido'
FROM vendedores v JOIN categorias c ON c.nombre='Hogar y Decoración'
WHERE v.nombre_tienda='Tienda Demo' AND NOT EXISTS(SELECT 1 FROM productos WHERE nombre='Mesa de Centro Nórdica') LIMIT 1;
INSERT INTO producto_imagenes (producto_id,url_imagen,orden)
SELECT id,'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80',1 FROM productos p WHERE nombre='Mesa de Centro Nórdica'
AND NOT EXISTS(SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id=p.id);
