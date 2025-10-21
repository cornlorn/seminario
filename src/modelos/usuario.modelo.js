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
  { tableName: "usuarios", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);
