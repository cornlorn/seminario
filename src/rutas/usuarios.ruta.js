import { Router } from "express";
import { crearUsuario } from "../controladores/autenticacion/crear.controlador.js";
import { ingresar } from "../controladores/autenticacion/ingresar.controlador.js";
import { registrar } from "../controladores/autenticacion/registrar.controlador.js";
import { restablecer } from "../controladores/autenticacion/restablecer.controlador.js";
import { solicitar } from "../controladores/autenticacion/solicitar.controlador.js";
import {
    esAdministrador,
    soloRegistroCliente,
    verificarToken,
} from "../middlewares/autenticacion.middleware.js";
import {
    validarCreacionUsuario,
    validarIngreso,
    validarRegistro,
    validarRestablecimiento,
    validarSolicitud,
} from "../validadores/validadores.js";

const router = Router();

router.post("/registrar", soloRegistroCliente, validarRegistro, registrar);
router.post("/ingresar", validarIngreso, ingresar);
router.post("/solicitar", validarSolicitud, solicitar);
router.post("/restablecer", validarRestablecimiento, restablecer);

router.post("/crear", verificarToken, esAdministrador, validarCreacionUsuario, crearUsuario);

export { router as usuariosRutas };
