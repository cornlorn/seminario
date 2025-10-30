import { Router } from 'express';
import { cambiar } from '../controladores/avatar/cambiar.controller.mjs';

const router = Router();

router.post('/avatar', cambiar);

export { router as rutas };
