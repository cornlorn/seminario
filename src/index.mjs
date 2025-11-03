import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { specs } from '../swagger.mjs';
import { transportador } from './config/correo.config.mjs';
import { sequelize } from './config/database.config.mjs';
import { rutas } from './rutas/index.mjs';
import { administrador } from './servicios/cuentas/administrador.mjs';
import { iniciarEjecucionAutomatica } from './servicios/ejecutar.servicio.mjs';
import { inicializarDiaria } from './servicios/juegos/diaria.servicio.mjs';
import { iniciarSorteosAutomaticos } from './servicios/sorteos.servicio.mjs';

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', rutas);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/avatars', express.static('public/usuarios'));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await administrador();
  await inicializarDiaria();
  await transportador.verify();

  iniciarSorteosAutomaticos();
  iniciarEjecucionAutomatica();

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
    console.log(`Documentación disponible en: http://localhost:${PORT}/api/docs`);
  });
} catch (error) {
  console.error('Error: No se pudo iniciar el servidor');
  console.error(error.message);
  process.exit(1);
}
