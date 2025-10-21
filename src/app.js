import "dotenv/config";
import express from "express";
import { database } from "./config/database.js";
import usuarioRutas from "./rutas/usuario.ruta.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/usuarios", usuarioRutas);

try {
  await database();

  app.listen(port, () => {
    console.log(`Servidor iniciado correctamente en el puerto ${port}.`);
  });
} catch (error) {
  console.error("Se produjo un error al iniciar el servidor:", error);
}
