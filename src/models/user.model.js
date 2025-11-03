import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    correo: { type: DataTypes.STRING, allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM('Administrador', 'Vendedor', 'Jugador'), defaultValue: 'Jugador' },
    estado: { type: DataTypes.ENUM('Activo', 'Inactivo'), defaultValue: 'Activo' },
  },
  { tableName: 'usuarios', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
