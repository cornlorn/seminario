import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { specs } from '../swagger.mjs';
import { transportador } from './configuraciones/correo.mjs';
import { sequelize } from './configuraciones/database.mjs';
import { rutas } from './rutas/index.mjs';
import { administrador } from './utils/administrador.mjs';

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', rutas);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));

try {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await administrador();
  await transportador.verify();
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
    console.log(
      `Documentación disponible en: http://localhost:${PORT}/api/docs`,
    );
  });
} catch (error) {
  console.error('Error: No se pudo iniciar el servidor');
  console.error(error.message);
  process.exit(1);
}
