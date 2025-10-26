import { body, validationResult } from "express-validator";

export const manejarErrores = (request, response, next) => {
    const errores = validationResult(request);

    if (!errores.isEmpty()) {
        return response
            .status(400)
            .json({
                mensaje: "Errores de validación",
                errores: errores
                    .array()
                    .map((error) => ({ campo: error.path, mensaje: error.msg })),
            });
    }

    next();
};

export const validarRegistro = [
    body("correo")
        .trim()
        .notEmpty()
        .withMessage("El correo es requerido")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido")
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage("El correo no puede exceder 100 caracteres"),

    body("contrasena")
        .notEmpty()
        .withMessage("La contraseña es requerida")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
        ),

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ max: 50 })
        .withMessage("El nombre no puede exceder 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El nombre solo puede contener letras y espacios"),

    body("apellido")
        .trim()
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isLength({ max: 50 })
        .withMessage("El apellido no puede exceder 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El apellido solo puede contener letras y espacios"),

    body("identidad")
        .trim()
        .notEmpty()
        .withMessage("El número de identidad es requerido")
        .matches(/^\d{13}$/)
        .withMessage("El número de identidad debe tener exactamente 13 dígitos"),

    body("telefono")
        .trim()
        .notEmpty()
        .withMessage("El teléfono es requerido")
        .matches(/^[0-9]{8}$/)
        .withMessage("El teléfono debe tener exactamente 8 dígitos"),

    body("departamento")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("El departamento debe ser un número válido")
        .toInt(),

    body("municipio")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("El municipio debe ser un número válido")
        .toInt(),

    manejarErrores,
];

export const validarCreacionUsuario = [
    body("correo")
        .trim()
        .notEmpty()
        .withMessage("El correo es requerido")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido")
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage("El correo no puede exceder 100 caracteres"),

    body("permiso")
        .notEmpty()
        .withMessage("El permiso es requerido")
        .isIn(["Administrador", "Empleado", "Cliente"])
        .withMessage("El permiso debe ser: Administrador, Empleado o Cliente"),

    body("nombre")
        .if(body("permiso").equals("Cliente"))
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido para clientes")
        .isLength({ max: 50 })
        .withMessage("El nombre no puede exceder 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El nombre solo puede contener letras y espacios"),

    body("apellido")
        .if(body("permiso").equals("Cliente"))
        .trim()
        .notEmpty()
        .withMessage("El apellido es requerido para clientes")
        .isLength({ max: 50 })
        .withMessage("El apellido no puede exceder 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El apellido solo puede contener letras y espacios"),

    body("identidad")
        .if(body("permiso").equals("Cliente"))
        .trim()
        .notEmpty()
        .withMessage("El número de identidad es requerido para clientes")
        .matches(/^\d{13}$/)
        .withMessage("El número de identidad debe tener exactamente 13 dígitos"),

    body("telefono")
        .if(body("permiso").equals("Cliente"))
        .trim()
        .notEmpty()
        .withMessage("El teléfono es requerido para clientes")
        .matches(/^[0-9]{8}$/)
        .withMessage("El teléfono debe tener exactamente 8 dígitos"),

    body("departamento")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("El departamento debe ser un número válido")
        .toInt(),

    body("municipio")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("El municipio debe ser un número válido")
        .toInt(),

    manejarErrores,
];

export const validarIngreso = [
    body("correo")
        .trim()
        .notEmpty()
        .withMessage("El correo es requerido")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido")
        .normalizeEmail(),

    body("contrasena").notEmpty().withMessage("La contraseña es requerida"),

    manejarErrores,
];

export const validarSolicitud = [
    body("correo")
        .trim()
        .notEmpty()
        .withMessage("El correo es requerido")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido")
        .normalizeEmail(),

    manejarErrores,
];

export const validarRestablecimiento = [
    body("codigo")
        .trim()
        .notEmpty()
        .withMessage("El código de recuperación es requerido")
        .matches(/^\d{6}$/)
        .withMessage("El código debe tener exactamente 6 dígitos"),

    body("contrasena")
        .notEmpty()
        .withMessage("La nueva contraseña es requerida")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
        ),

    manejarErrores,
];
