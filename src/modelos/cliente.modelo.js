import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Cliente = sequelize.define(
    "Cliente",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: "usuarios", key: "id" },
        },
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        apellido: { type: DataTypes.STRING(50), allowNull: false },
        identidad: { type: DataTypes.STRING(13), allowNull: false, unique: true },
        departamento: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "departamentos", key: "id" },
        },
        municipio: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "municipios", key: "id" },
        },
    },
    { tableName: "clientes", timestamps: true, createdAt: "creado", updatedAt: "actualizado" },
);
