import { Router } from 'express';
import { rutasAdmin } from './admin.routes.js';
import { rutasJuegos } from './games.routes.js';
import { rutasUsuarios } from './users.routes.js';
import { rutasVendedor } from './seller.routes.js';

const router = Router();

router.use('/usuarios', rutasUsuarios);
router.use('/juegos', rutasJuegos);
router.use('/admin', rutasAdmin);
router.use('/vendedor', rutasVendedor);

export { router as rutas };
