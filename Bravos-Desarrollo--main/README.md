# 💪 BRAVOS - E-Commerce de Suplementos Deportivos

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-61dafb.svg)

> Plataforma completa de e-commerce para la venta de suplementos deportivos con aplicación web, API REST y aplicación móvil.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Deployment](#-deployment)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🌐 Aplicación Web
- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Carrito de compras interactivo
- ✅ Sistema de autenticación (Login/Registro)
- ✅ Perfil de usuario personalizado
- ✅ Historial de pedidos
- ✅ Sistema de reseñas y calificaciones
- ✅ Diseño responsive y moderno
- ✅ Gestión de pedidos pendientes

### 🖥️ Backend API
- ✅ API RESTful con Express.js
- ✅ Autenticación JWT
- ✅ CRUD completo de productos
- ✅ Gestión de usuarios
- ✅ Sistema de pedidos
- ✅ Base de datos MySQL con Sequelize ORM
- ✅ Middleware de autenticación
- ✅ CORS configurado

### 📱 Aplicación Móvil
- ✅ Aplicación React Native con Expo
- ✅ Sincronización con backend
- ✅ Navegación nativa
- ✅ Gestión de estado global

---

## 🚀 Tecnologías

### Frontend Web
| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| React | 19.1.1 | Librería de UI |
| Vite | 7.1.14 | Build tool y dev server |
| React Router | 7.9.4 | Enrutamiento SPA |
| Tailwind CSS | 4.1.14 | Framework de CSS |
| Lucide React | 0.545.0 | Iconos |
| Sonner | 2.0.7 | Notificaciones toast |

### Backend
| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| Node.js | ≥18.0.0 | Runtime de JavaScript |
| Express | 5.1.0 | Framework web |
| MySQL | 8.0+ | Base de datos |
| Sequelize | 6.37.7 | ORM |
| JWT | 9.0.2 | Autenticación |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |

### Mobile
| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| React Native | Latest | Framework móvil |
| Expo | 54.0.25 | Plataforma de desarrollo |

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  👤 USUARIO                                     │
│                                                 │
└────────────┬────────────────────────────────────┘
             │
             ├──────────────────┬─────────────────┐
             │                  │                 │
             ▼                  ▼                 ▼
    ┌────────────────┐  ┌──────────────┐  ┌─────────────┐
    │   🌐 VERCEL    │  │  🖥️ RAILWAY  │  │  📱 EXPO    │
    │   Frontend     │  │   Backend    │  │   Mobile    │
    │   React+Vite   │  │   Node.js    │  │   App       │
    └────────────────┘  └──────┬───────┘  └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  🗄️ MySQL DB │
                        │   Railway    │
                        └──────────────┘
```

---

## 📦 Instalación

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MySQL** ≥ 8.0
- **Git**

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/bravos-desarrollo.git
cd bravos-desarrollo
```

### 2️⃣ Instalar Dependencias del Frontend

```bash
npm install
```

### 3️⃣ Instalar Dependencias del Backend

```bash
cd backend
npm install
cd ..
```

### 4️⃣ Instalar Dependencias de la App Móvil (Opcional)

```bash
cd bravos-mobile
npm install
cd ..
```

---

## ⚙️ Configuración

### 🌐 Frontend - Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### 🖥️ Backend - Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```bash
cd backend
cp .env.example .env
```

Edita el archivo `backend/.env`:

```env
# Servidor
PORT=3001
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bravos_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
```

### 🗄️ Base de Datos - Configuración

#### Opción 1: Crear Base de Datos Manualmente

```sql
CREATE DATABASE bravos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Opción 2: Usar Scripts de Inicialización

```bash
cd backend

# Inicializar base de datos y crear tablas
npm run init-db

# Poblar con datos de prueba
npm run seed-db
```

---

## 🎮 Uso

### Desarrollo Local

#### 1️⃣ Iniciar el Backend

```bash
cd backend
npm start
```

El servidor estará disponible en: `http://localhost:3001`

#### 2️⃣ Iniciar el Frontend

En otra terminal:

```bash
npm run dev
```

La aplicación web estará disponible en: `http://localhost:5173`

#### 3️⃣ Iniciar la App Móvil (Opcional)

En otra terminal:

```bash
cd bravos-mobile
npm start
```

Escanea el código QR con la app Expo Go en tu dispositivo móvil.

### Usuarios de Prueba

Después de ejecutar `npm run seed-db`, puedes usar:

```
Email: admin@bravos.com
Password: admin123
Rol: Administrador

Email: user@bravos.com
Password: user123
Rol: Cliente
```

---

## 🚀 Deployment

### 🌐 Frontend en Vercel

#### Opción 1: Desde el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```
4. Deploy automático

#### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

### 🖥️ Backend en Railway

#### Opción 1: Desde el Dashboard de Railway

1. Ve a [railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Agrega un servicio MySQL
5. Configura las variables de entorno:
   ```
   NODE_ENV=production
   PORT=3001
   DB_HOST=<generado por Railway>
   DB_USER=root
   DB_PASSWORD=<generado por Railway>
   DB_NAME=railway
   JWT_SECRET=<tu_secreto_seguro>
   ```
6. Deploy automático

#### Opción 2: Desde CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

### 📱 App Móvil en Expo

```bash
cd bravos-mobile

# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Publicar actualización
eas update
```

---

## 📁 Estructura del Proyecto

```
Bravos-Desarrollo/
│
├── 📱 bravos-mobile/              # Aplicación móvil React Native
│   ├── screens/                   # Pantallas de la app
│   ├── services/                  # Servicios API
│   ├── store/                     # Estado global
│   └── App.js                     # Componente principal
│
├── 🖥️ backend/                    # API Backend
│   ├── src/
│   │   ├── config/                # Configuración (DB)
│   │   ├── controllers/           # Lógica de negocio
│   │   ├── models/                # Modelos Sequelize
│   │   ├── routes/                # Rutas de la API
│   │   ├── middlewares/           # Middlewares (auth)
│   │   └── server.js              # Servidor Express
│   ├── data/                      # Scripts SQL
│   ├── scripts/                   # Scripts de utilidad
│   └── package.json
│
├── 🌐 src/                        # Frontend React
│   ├── components/                # Componentes reutilizables
│   │   ├── landing/               # Componentes landing
│   │   ├── menu/                  # Componentes de menú
│   │   └── perfil/                # Componentes de perfil
│   ├── pages/                     # Páginas principales
│   │   ├── home.jsx
│   │   ├── login.jsx
│   │   ├── menu.jsx
│   │   └── ProfilePage.jsx
│   ├── herramientas/              # Utilidades
│   │   ├── api.js                 # Cliente HTTP
│   │   └── auth.js                # Funciones de auth
│   ├── App.jsx                    # Componente raíz
│   └── main.jsx                   # Punto de entrada
│
├── 📄 public/                     # Archivos estáticos
├── 📋 index.html                  # HTML principal
├── ⚙️ package.json                # Dependencias frontend
├── ⚙️ vite.config.js              # Configuración Vite
├── 🚀 vercel.json                 # Config Vercel
├── 🚀 railway.json                # Config Railway
└── 📖 README.md                   # Este archivo
```

Para más detalles, consulta: [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md)

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | ❌ |
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| GET | `/api/auth/me` | Obtener usuario actual | ✅ |

### Productos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Listar todos los productos | ❌ |
| GET | `/api/products/:id` | Obtener producto por ID | ❌ |
| POST | `/api/products` | Crear producto | ✅ Admin |
| PUT | `/api/products/:id` | Actualizar producto | ✅ Admin |
| DELETE | `/api/products/:id` | Eliminar producto | ✅ Admin |

### Pedidos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Listar pedidos del usuario | ✅ |
| GET | `/api/orders/:id` | Obtener pedido por ID | ✅ |
| POST | `/api/orders` | Crear nuevo pedido | ✅ |
| PUT | `/api/orders/:id` | Actualizar estado del pedido | ✅ Admin |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Listar todos los usuarios | ✅ Admin |
| GET | `/api/users/:id` | Obtener usuario por ID | ✅ |
| PUT | `/api/users/:id` | Actualizar usuario | ✅ |
| DELETE | `/api/users/:id` | Eliminar usuario | ✅ Admin |

### Reseñas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews/product/:id` | Obtener reseñas de un producto | ❌ |
| POST | `/api/reviews` | Crear reseña | ✅ |
| PUT | `/api/reviews/:id` | Actualizar reseña | ✅ |
| DELETE | `/api/reviews/:id` | Eliminar reseña | ✅ |

---

## 🗄️ Base de Datos

### Diagrama de Relaciones

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   USERS     │       │   ORDERS     │       │  PRODUCTS   │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)      │   ┌──│ id (PK)     │
│ nombre      │  │    │ user_id (FK) │───┘  │ nombre      │
│ email       │  │    │ total        │      │ descripcion │
│ password    │  │    │ estado       │      │ precio      │
│ rol         │  │    │ fecha        │      │ categoria   │
│ telefono    │  │    └──────────────┘      │ stock       │
│ direccion   │  │            │             │ imagen_url  │
└─────────────┘  │            │             └─────────────┘
       │         │            │                     │
       │         │    ┌───────────────┐            │
       │         │    │  ORDER_ITEMS  │            │
       │         │    ├───────────────┤            │
       │         │    │ id (PK)       │            │
       │         │    │ order_id (FK) │────────────┘
       │         │    │ product_id(FK)│
       │         │    │ cantidad      │
       │         │    │ precio_unit   │
       │         │    └───────────────┘
       │         │
       │         │    ┌─────────────┐
       │         └────│   REVIEWS   │
       │              ├─────────────┤
       │              │ id (PK)     │
       └──────────────│ user_id(FK) │
                      │ product_id  │
                      │ rating      │
                      │ comentario  │
                      │ fecha       │
                      └─────────────┘
```

### Tablas Principales

#### `users`
- **id**: INT (PK, Auto Increment)
- **nombre**: VARCHAR(100)
- **email**: VARCHAR(100) UNIQUE
- **password**: VARCHAR(255) (hash bcrypt)
- **rol**: ENUM('cliente', 'admin')
- **telefono**: VARCHAR(20)
- **direccion**: TEXT

#### `products`
- **id**: INT (PK, Auto Increment)
- **nombre**: VARCHAR(200)
- **descripcion**: TEXT
- **precio**: DECIMAL(10,2)
- **categoria**: VARCHAR(50)
- **stock**: INT
- **imagen_url**: VARCHAR(500)

#### `orders`
- **id**: INT (PK, Auto Increment)
- **user_id**: INT (FK → users.id)
- **total**: DECIMAL(10,2)
- **estado**: ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado')
- **fecha**: TIMESTAMP

#### `order_items`
- **id**: INT (PK, Auto Increment)
- **order_id**: INT (FK → orders.id)
- **product_id**: INT (FK → products.id)
- **cantidad**: INT
- **precio_unitario**: DECIMAL(10,2)

#### `reviews`
- **id**: INT (PK, Auto Increment)
- **user_id**: INT (FK → users.id)
- **product_id**: INT (FK → products.id)
- **rating**: INT (1-5)
- **comentario**: TEXT
- **fecha**: TIMESTAMP

---

## 📜 Scripts Disponibles

### Frontend

```bash
npm run dev          # Iniciar servidor de desarrollo (puerto 5173)
npm run build        # Compilar para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar ESLint
```

### Backend

```bash
npm start            # Iniciar servidor (producción)
npm run dev          # Iniciar servidor con nodemon (desarrollo)
npm run init-db      # Inicializar base de datos
npm run seed-db      # Poblar con datos de prueba
npm run reset-db     # Resetear base de datos
npm run test-conn    # Probar conexión a base de datos
```

### Mobile

```bash
npm start            # Iniciar Expo
npm run android      # Ejecutar en Android
npm run ios          # Ejecutar en iOS
npm run web          # Ejecutar en navegador
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- Usa **ESLint** para mantener el código limpio
- Sigue las convenciones de **React** y **Node.js**
- Escribe commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📚 Documentación Adicional

- [📁 Estructura del Proyecto](./ESTRUCTURA_PROYECTO.md)
- [🚀 Guía de Deployment](./DEPLOYMENT_VERCEL_RAILWAY.md)
- [📊 Análisis Completo del Proyecto](./ANALISIS_COMPLETO_PROYECTO.md)

---

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/tu-usuario/bravos-desarrollo/issues) con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Información del sistema (OS, navegador, versión de Node)

---

## 📞 Contacto

- **Email**: contacto@bravos.com
- **Website**: https://bravos.vercel.app
- **GitHub**: https://github.com/tu-usuario/bravos-desarrollo

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Railway](https://railway.app/)
- [Expo](https://expo.dev/)

---

<div align="center">

**Hecho con ❤️ por el equipo de Bravos**

⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐

</div>
