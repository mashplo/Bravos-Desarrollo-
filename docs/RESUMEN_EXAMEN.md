Resumen breve
===============

Qué es
------
Tienda web para pedir hamburguesas y bebidas. Frontend en React, backend en Node.js y base de datos MySQL. También generamos RDF con datos clave.

Integración Web ↔ Mobile
-----------------------
- El backend es una API REST (JSON). La app móvil puede usar las mismas rutas que la web.
- Beneficio: se reutiliza la lógica y los endpoints sin rehacer el servidor.

Login (cómo funciona)
---------------------
- Usuario envía email/contraseña.
- Backend devuelve un JWT que guardamos en `localStorage`.
- El token se envía en `Authorization: Bearer <token>` a rutas protegidas.

Tecnologías y por qué
---------------------
- React: interfaz rápida y reutilizable para mobile.
- Node.js + Express: API REST rápida y fácil de desarrollar.
- MySQL + Sequelize: datos relacionales para pedidos.
- Expo / React Native (opcional): para llevar la app a móviles rápidamente.

Módulos principales
-------------------
Frontend:
- `menu/*`: mostrar productos y añadir al carrito.
- `menu/sidebar.jsx`: carrito (mostrar, cambiar cantidad, checkout).
- `herramientas/usuario.js`: lógica del carrito y llamadas a la API.
- `herramientas/productos.js`: catálogo local.

Backend:
- `controllers/auth.controller.js`: login/registro (JWT).
- `controllers/pedido.controller.js`: crear pedidos y detalles.
- `models/`: `User`, `Pedido`, `DetallePedido`, `Producto`, `Resena`.

Arquitectura (simple)
---------------------
Cliente (React) ↔ API REST (Node/Express) ↔ Base de datos (MySQL).

RDF (lo esencial)
-----------------
- Contiene tripletas que describen productos, pedidos y usuarios.
- Modelo simple propio (vocabulario del dominio). Se puede mapear a `schema.org` si se necesita.
- Propósito: exportar datos semánticos para consultas y análisis (SPARQL o integración externa).

Qué mostrar en el examen
------------------------
1. Login.
2. Añadir hamburguesa y bebida al carrito.
3. Abrir carrito y mostrar ambos items.
4. Realizar checkout y mostrar la respuesta de `POST /api/pedidos`.
5. Mostrar 2-3 tripletas del archivo `backend/data/bravosRDF.ttl`.

Notas rápidas
------------
- Si el carrito no muestra bebidas: recarga la página (Ctrl+F5) y revisa `localStorage.getItem('carrito')`.
- Para mobile usamos `AsyncStorage` en lugar de `localStorage`.

Archivo generado: `docs/RESUMEN_EXAMEN.md`
