import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { specs } from './config/swagger.config.js';
import { transportador } from './config/email.config.js';
import { sequelize } from './config/database.config.js';
import { rutas } from './routes/index.js';
import { administrador } from './services/accounts/admin.service.js';
import { iniciarEjecucionAutomatica } from './services/execute.service.js';
import { inicializarDiaria } from './services/games/daily.service.js';
import { inicializarJugaTres } from './services/games/play-three.service.js';
import { iniciarSorteosAutomaticos } from './services/draws.service.js';

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
  await inicializarJugaTres();
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
