import "dotenv/config";
import express from "express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swagger from "swagger-ui-express";
import { swaggerOptions } from "../swagger.js";
import { sequelize } from "./config/database.js";
import { rutas } from "./rutas/index.js";

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
  await sequelize.sync({ force: true });
  app.listen(PORT, () => {
    console.log(`Se inició el servidor en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error: No se pudo iniciar el servidor.");
  console.error(error);
}
