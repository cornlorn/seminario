import { Router } from 'express';
import { rutasUsuarios } from './usuarios.ruta.mjs';

const router = Router();

router.use('/usuarios', rutasUsuarios);

export { router as rutas };
