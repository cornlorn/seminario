import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Municipio = sequelize.define(
    "Municipio",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        departamento: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "departamentos", key: "id" },
        },
        codigo: { type: DataTypes.STRING(10), allowNull: true },
    },
    { tableName: "municipios", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);
