import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Departamento = sequelize.define(
  'Departamento',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    codigo: { type: DataTypes.STRING(10), allowNull: true, unique: true },
  },
  {
    tableName: 'departamentos',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
  },
);
