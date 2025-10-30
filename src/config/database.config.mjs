import { Sequelize } from 'sequelize';

if (
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_HOST
) {
  console.error(
    'Error: Faltan variables de entorno para la conexión a la base de datos',
  );
  process.exit(1);
}

const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});
