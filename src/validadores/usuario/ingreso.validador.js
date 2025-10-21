import { body } from "express-validator";

export const validarIngresoUsuario = [
  body("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El correo no puede superar 100 caracteres"),

  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
];
