import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    correo: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING, allowNull: false },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo"),
      allowNull: false,
      defaultValue: "activo",
    },
    permiso: {
      type: DataTypes.ENUM("administrador", "empleado", "cliente"),
      allowNull: false,
      defaultValue: "cliente",
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "creado",
    updatedAt: "actualizado",
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.contrasena) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("contrasena")) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
      },
    },
  },
);

Usuario.prototype.validarContrasena = async function (contrasenaPlano) {
  return await bcrypt.compare(contrasenaPlano, this.contrasena);
};
