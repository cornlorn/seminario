# 👨‍💻 Seminario: Taller de Software

Una API de **Express.js** que opera la lógica de una app de lotería.

---

## 🚀 Características

- Endpoints de API RESTful para todas las operaciones CRUD
- **ORM Sequelize** con integración **MySQL**
- Entornos configurables usando .env
- Estructura MVC modular (`src/modelos`, `src/controladores`, `src/rutas`)
- Manejo de errores centralizado
- Scripts preconfigurados para desarrollo y producción

---

## 🧱 Stack Tecnológico

- **Node.js** — Entorno de ejecución
- **Express.js** — Framework web
- **Sequelize** — ORM para MySQL
- **MySQL** — Base de datos relacional
- **dotenv** — Gestión de variables de entorno

---

## 🧩 Estructura del Proyecto

```
seminario/
├── src/
│   ├── config/           Configuración de la base de datos
│   ├── controladores/    Lógica de negocio
│   ├── modelos/          Modelos de Sequelize
│   ├── rutas/            Rutas de la API
│   ├── validadores/      Middleware de validaciones
│   └── app.js            Configuración de la app Express
│
├── package.json          Dependencias y scripts
└── README.md             Documentación del proyecto
```

---

## 💻 Instalación

Para clonar el repositorio:

```bash
git clone https://github.com/cloxious/seminario.git
```

Para entrar al directorio:

```bash
cd seminario
```

Para instalar las dependencias:

```bash
npm install
```

---

## ✍️ Formato del código

- Instalar la extensión de [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) para detectar errores automaticamente.
- Para formatear el código y buscar errores:

```
npm run biome
```

---

## ⚙️ Configuración del Entorno

Crea un archivo `.env` en el directorio raíz con el siguiente contenido:

```
PORT=
DB_NAME=
DB_USER=
DB_PASS=
DB_HOST=
```

---

## 🏃‍♂️ Ejecutando el Servidor

Para iniciar el servidor de desarrollo:

```
npm run dev
```

Para ejecutar en modo de producción:

```
npm start
```

El servidor estará disponible en el [puerto 3000](http://localhost:3000).

## 📝 Notas

- Punto de entrada principal: `src/app.js`
- Puerto por defecto: 3000
- Asegúrate de que MySQL esté en ejecución antes de iniciar la aplicación.
