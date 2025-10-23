// import { sequelize } from "../config/database.js";
// import { Billetera } from "../modelos/billetera.modelo.js";
// import { Perfil } from "../modelos/perfil.modelo.js";
// import { Usuario } from "../modelos/usuario.modelo.js";

// export const crearCuentaAdmin = async () => {
//   const correo = process.env.ADMIN_EMAIL;
//   const contrasena = process.env.ADMIN_PASSWORD;
//   const permiso = "administrador";

//   const nombre = process.env.ADMIN_NOMBRE;
//   const apellido = process.env.ADMIN_APELLIDO;
//   const identidad = process.env.ADMIN_IDENTIDAD;
//   const telefono = process.env.ADMIN_TELEFONO;
//   const nacimiento = process.env.ADMIN_NACIMIENTO;

//   if (
//     !correo ||
//     !contrasena ||
//     !nombre ||
//     !apellido ||
//     !identidad ||
//     !telefono ||
//     !nacimiento
//   ) {
//     console.log(
//       "Variables de entorno de administrador no configuradas. Omitiendo creación de cuenta admin.",
//     );
//     return;
//   }

//   const transaction = await sequelize.transaction();

//   try {
//     const existente = await Usuario.findOne({ where: { correo } });
//     if (existente) {
//       console.log("El correo ya está registrado:", correo);
//       await transaction.rollback();
//       return;
//     }

//     const usuario = await Usuario.create(
//       { correo, contrasena, permiso },
//       { transaction },
//     );

//     await Perfil.create(
//       {
//         usuario: usuario.id,
//         nombre,
//         apellido,
//         identidad,
//         telefono,
//         nacimiento,
//       },
//       { transaction },
//     );

//     await Billetera.create({ usuario: usuario.id }, { transaction });

//     await transaction.commit();
//     console.log("Cuenta de administrador creada exitosamente:", correo);
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error al crear cuenta de administrador:", error.message);
//   }
// };
