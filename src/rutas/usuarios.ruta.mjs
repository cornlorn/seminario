import { Router } from 'express';
import { registrar } from '../controladores/auth/registrar.controlador.mjs';

const router = Router();

router.post('/registrar', registrar);

export { router as rutasUsuarios };
