import { Router } from "express";
import { registrarUsuario } from "../controladores/usuario/registrar.controlador.js";
import { verificarTokenOpcional } from "../middlewares/autenticacion.middleware.js";
import { validarRegistroUsuario } from "../validadores/usuario/registro.validador.js";

const router = Router();

router.post("/registrar", verificarTokenOpcional, validarRegistroUsuario, registrarUsuario);

export default router;
