import "dotenv/config";
import express from "express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swagger from "swagger-ui-express";
import { swaggerOptions } from "../swagger.js";
import { sequelize } from "./config/database.js";
import { rutas } from "./rutas/index.js";
import { cuenta } from "./utils/administrador.js";
import "./modelos/relaciones.js";

const app = express();
const PORT = process.env.PORT || 3000;
const specs = swaggerJSDoc(swaggerOptions);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", rutas);
app.use("/api/docs", swagger.serve, swagger.setup(specs));

app.use((_request, response) => {
    response.redirect("/api/docs");
});

try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida");

    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados");

    await cuenta();

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en http://localhost:${PORT}`);
        console.log(`Documentación API: http://localhost:${PORT}/api/docs`);
    });
} catch (error) {
    console.error("Error: No se pudo iniciar el servidor.");
    console.error(error);
    process.exit(1);
}
