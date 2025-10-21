import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Usuario } from "./usuario.modelo.js";

export const Perfil = sequelize.define(
  "Perfil",
  {
    usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: "usuarios", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(50), allowNull: false },
    identidad: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING(20), allowNull: false },
    nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  },
  { tableName: "perfiles", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);

Perfil.belongsTo(Usuario, { foreignKey: "usuario" });
Usuario.hasOne(Perfil, { foreignKey: "usuario" });
