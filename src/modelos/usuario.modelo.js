import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Usuario = sequelize.define(
  "Usuario",
  {
    correo: {
      type: DataTypes.STRING(),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    contraseña: { type: DataTypes.STRING(), allowNull: false },
    nombre: { type: DataTypes.STRING(), allowNull: false },
    apellido: { type: DataTypes.STRING(), allowNull: false },
    avatar: { type: DataTypes.STRING(), allowNull: true },
    permiso: {
      type: DataTypes.ENUM("administrador", "empleado", "cliente"),
      allowNull: false,
      defaultValue: "cliente",
    },
    credito: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
  },
  { tableName: "usuarios", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);
