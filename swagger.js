export const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Servicio API REST de Lotería",
            version: "1.0.0",
            description: "La API maneja los usuarios, juegos y compras de la app de lotería.",
        },
        servers: [{ url: "http://localhost:3000/api", description: "Servidor de desarrollo" }],
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
