import jwt from "jsonwebtoken";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
export const verificarToken = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ error: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.usuario = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    return response.status(401).json({ error: "Token inválido" });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
export const verificarTokenOpcional = (request, _response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.usuario = decoded;
  } catch (error) {
    console.error("Error al verificar token:", error);
  } finally {
    next();
  }
};
