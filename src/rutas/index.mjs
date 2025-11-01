import { Router } from 'express';
import { rutasJuegos } from './juegos.ruta.mjs';
import { rutasUsuarios } from './usuarios.ruta.mjs';

const router = Router();

router.use('/usuarios', rutasUsuarios);
router.use('/juegos', rutasJuegos);

export { router as rutas };
