import swaggerJSDoc from 'swagger-jsdoc';

const { PORT = 3000 } = process.env;

const opciones = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST de lotería',
      version: '1.0.0',
      description: 'API para gestionar usuarios, juegos y compras en la aplicación de lotería',
    },
    servers: [{ url: `http://localhost:${PORT}/api`, description: 'Servidor de desarrollo' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/routes/**/*.js'],
};

export const specs = swaggerJSDoc(opciones);
