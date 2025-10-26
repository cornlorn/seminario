import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Billetera = sequelize.define(
    "Billetera",
    {
        usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: { model: "usuarios", key: "id" },
            onDelete: "CASCADE",
        },
        saldo: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
    },
    { tableName: "billeteras", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);
