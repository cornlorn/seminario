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

Archivos raíz relevantes:

- [`swagger.mjs`](swagger.mjs) — Configuración de la documentación OpenAPI
- [`package.json`](package.json) — Scripts y dependencias
- [`.env`](.env) — Variables de entorno

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
APP_NAME=LOTO
```

---

## 🧩 Scripts disponibles

Instalar dependencias:

```bash
npm install
```

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

---

## 🧠 Notas útiles

- Los archivos subidos se almacenan en `public/usuarios/<id>`
- El servidor expone `/public` como ruta estática
- Si algo falla en el arranque, revisa que las variables `.env` estén completas
- Las relaciones entre modelos están definidas en [`src/modelos/index.mjs`](src/modelos/index.mjs)
