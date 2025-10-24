export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: { title: "", version: "1.0.0", description: "" },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Introduce tu Token JWT con el prefijo Bearer.",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.js"],
};
