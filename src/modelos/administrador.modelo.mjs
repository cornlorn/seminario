import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Administrador = sequelize.define(
  'Administrador',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'administradores', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
