import { Router } from 'express';
import { rutasAdmin } from './admin.ruta.mjs';
import { rutasJuegos } from './juegos.ruta.mjs';
import { rutasUsuarios } from './usuarios.ruta.mjs';
import { rutasVendedor } from './vendedor.ruta.mjs';

const router = Router();

router.use('/usuarios', rutasUsuarios);
router.use('/juegos', rutasJuegos);
router.use('/admin', rutasAdmin);
router.use('/vendedor', rutasVendedor);

export { router as rutas };
