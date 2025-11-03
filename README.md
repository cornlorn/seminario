# 🎯 Seminario: Taller de Software

API REST construida con **Express.js** y **Sequelize** para la gestión de una aplicación de lotería.  
Incluye autenticación JWT, manejo de usuarios, administración, carga de avatares, envío de correos y documentación OpenAPI.

---

## 🚀 Descripción general

- **Framework principal:** Express.js
- **Base de datos:** Sequelize ORM (MySQL)
- **Autenticación:** JWT con middlewares de validación
- **Documentación:** OpenAPI (Swagger)
- **Email:** Nodemailer con plantillas dinámicas
- **Archivos:** Subida y manejo de avatares con Multer

---

## 📁 Estructura del proyecto

```
src/
├── config/          # Configuración (database, email, multer, swagger)
├── constants/       # Constantes globales (roles, estados, etc.)
├── controllers/     # Controladores de rutas
│   ├── auth/       # Controladores de autenticación
│   └── avatar/     # Controladores de avatar
├── middlewares/     # Middlewares (auth, validation, error-handler)
├── models/          # Modelos de Sequelize
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
│   ├── accounts/   # Servicios de cuentas
│   ├── email/      # Servicios de correo electrónico
│   │   └── templates/  # Plantillas HTML de correos
│   └── games/      # Servicios de juegos
├── utils/           # Utilidades reutilizables
├── validations/     # Validaciones de express-validator
└── index.js         # Punto de entrada de la aplicación
```

---

## 📝 Convenciones de código

### Nomenclatura de archivos

El proyecto sigue convenciones de nombres en inglés con guiones para separar palabras:

- **Rutas:** `*.routes.js` (ej: `users.routes.js`)
- **Controladores:** `*.controller.js` (ej: `login.controller.js`)
- **Modelos:** `*.model.js` (ej: `user.model.js`)
- **Servicios:** `*.service.js` (ej: `admin.service.js`)
- **Utilidades:** `*.util.js` (ej: `password.util.js`)
- **Validaciones:** `*.validation.js` (ej: `login.validation.js`)
- **Middlewares:** `*.middleware.js` (ej: `auth.middleware.js`)
- **Configuración:** `*.config.js` (ej: `database.config.js`)
- **Plantillas:** `*.template.js` (ej: `registration.template.js`)
- **Emails:** `*.email.js` (ej: `registration.email.js`)

### Convenciones generales

- Nombres de archivos en minúsculas con guiones (`kebab-case`)
- Nombres de carpetas en plural cuando contienen múltiples elementos del mismo tipo
- Constantes globales centralizadas en `src/constants/`
- Manejo de errores centralizado en middleware global

---

## ⚙️ Variables de entorno

Ejemplo de configuración mínima en `.env`:

```env
# Base de datos
DB_NAME=
DB_USER=
DB_PASS=
DB_HOST=

# JWT
JWT_SECRET=

# Administrador por defecto
ADMIN_USER=
ADMIN_PASS=
ADMIN_NAME=
ADMIN_SURNAME=

# Correo electrónico
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# Servidor
PORT=

# Aplicación
APP_NAME=
```

---

## 🧩 Scripts disponibles

Instalar dependencias:

```bash
npm install
```

Modo desarrollo (con recarga automática):

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Formatear código:

```bash
npm run format
```

---

## 🧠 Notas útiles

- Los archivos subidos se almacenan en `public/usuarios/<id>`
- El servidor expone `/avatars` como ruta estática para los avatares
- Si algo falla en el arranque, revisa que las variables `.env` estén completas
- Las relaciones entre modelos están definidas en [`src/models/index.js`](src/models/index.js)
- La documentación de la API está disponible en `/api/docs` cuando el servidor está corriendo
- El manejo de errores global se encuentra en [`src/middlewares/error-handler.middleware.js`](src/middlewares/error-handler.middleware.js)

---

## 🔐 Roles del sistema

El sistema maneja tres roles principales:

- **Administrador:** Gestión completa del sistema
- **Vendedor:** Venta de boletos y comisiones
- **Jugador:** Compra de boletos y gestión de saldo

Los roles están centralizados en [`src/constants/roles.constants.js`](src/constants/roles.constants.js)
