import { body } from "express-validator";
import { Perfil } from "../../modelos/perfil.modelo.js";
import { Usuario } from "../../modelos/usuario.modelo.js";

export const validarRegistroUsuario = [
  body("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El correo no puede superar 100 caracteres")
    .bail()
    .custom(async (value) => {
      const existe = await Usuario.findOne({ where: { correo: value } });
      if (existe) throw new Error("El correo ya está registrado");
      return true;
    }),

  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios")
    .bail()
    .isLength({ max: 50 })
    .withMessage("El nombre no puede superar 50 caracteres"),

  body("apellido")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .bail()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .withMessage("El apellido solo puede contener letras y espacios")
    .bail()
    .isLength({ max: 50 })
    .withMessage("El apellido no puede superar 50 caracteres"),

  body("identidad")
    .notEmpty()
    .withMessage("La identidad es obligatoria")
    .bail()
    .isLength({ min: 13, max: 13 })
    .withMessage("La identidad debe tener 13 dígitos")
    .bail()
    .isNumeric()
    .withMessage("La identidad debe contener solo números")
    .bail()
    .custom(async (value) => {
      const existe = await Perfil.findOne({ where: { identidad: value } });
      if (existe) throw new Error("La identidad ya está registrada");
      return true;
    }),

  body("telefono")
    .notEmpty()
    .withMessage("El teléfono es obligatorio")
    .bail()
    .isLength({ min: 8, max: 8 })
    .withMessage("El teléfono debe tener 8 dígitos")
    .bail()
    .isNumeric()
    .withMessage("El teléfono debe contener solo números"),

  body("nacimiento")
    .notEmpty()
    .withMessage("La fecha de nacimiento es obligatoria")
    .bail()
    .custom((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("La fecha de nacimiento debe tener el formato YYYY-MM-DD");
      }
      const fecha = new Date(value);
      if (Number.isNaN(fecha.getTime())) throw new Error("La fecha de nacimiento no es válida");

      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const mes = hoy.getMonth() - fecha.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }

      if (edad < 18) throw new Error("El usuario debe ser mayor de 18 años");
      if (edad > 120) throw new Error("La edad no puede ser mayor a 120 años");

      return true;
    }),

  body("permiso")
    .optional()
    .isIn(["administrador", "empleado", "cliente"])
    .withMessage("El permiso debe ser administrador, empleado o cliente"),
];
