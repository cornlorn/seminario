import { Router } from "express";
import { usuariosRutas } from "./usuarios.ruta.js";

const router = Router();

router.use("/usuarios", usuariosRutas);

export { router as rutas };
