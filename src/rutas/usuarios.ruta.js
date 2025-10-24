import { Router } from "express";
import { ingresarUsuario } from "../controladores/usuario/ingresar.controlador.js";
import { registrarUsuario } from "../controladores/usuario/registrar.controlador.js";
import { verificarTokenOpcional } from "../middlewares/autenticacion.middleware.js";
import { validarIngresoUsuario } from "../validadores/usuario/ingreso.validador.js";
import { validarRegistroUsuario } from "../validadores/usuario/registro.validador.js";

const router = Router();

router.post(
  "/registrar",
  verificarTokenOpcional,
  validarRegistroUsuario,
  registrarUsuario,
);

router.post("/ingresar", validarIngresoUsuario, ingresarUsuario);

export { router as usuariosRutas };
