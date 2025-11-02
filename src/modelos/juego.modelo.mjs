import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Juego = sequelize.define(
  'Juego',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('Activo', 'Inactivo'), defaultValue: 'Activo', allowNull: false },
  },
  { tableName: 'juegos', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
