import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    correo: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING, allowNull: false },
    permiso: {
      type: DataTypes.ENUM('Administrador', 'Empleado', 'Cliente'),
      defaultValue: 'Cliente',
    },
    recuperacion: { type: DataTypes.STRING, allowNull: true },
    expiracion: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
  },
);
