import { Router } from "express";
import { ingresar } from "../controladores/autenticacion/ingresar.controlador.js";
import { registrar } from "../controladores/autenticacion/registrar.controlador.js";
import { restablecer } from "../controladores/autenticacion/restablecer.controlador.js";
import { solicitar } from "../controladores/autenticacion/solicitar.controlador.js";

const router = Router();

router.post("/registrar", registrar);
router.post("/ingresar", ingresar);
router.post("/solicitar", solicitar);
router.post("/restablecer", restablecer);

export { router as usuariosRutas };
