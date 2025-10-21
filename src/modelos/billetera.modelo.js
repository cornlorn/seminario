import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Usuario } from "./usuario.modelo.js";

export const Billetera = sequelize.define(
  "Billetera",
  {
    usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: "usuarios", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    saldo: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
  },
  { tableName: "billeteras", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);

Billetera.belongsTo(Usuario, { foreignKey: "usuario" });
Usuario.hasOne(Billetera, { foreignKey: "usuario" });
