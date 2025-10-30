import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Token = sequelize.define(
  'Token',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tipo: { type: DataTypes.ENUM('Confirmacion', 'Recuperacion'), allowNull: false },
    codigo: { type: DataTypes.STRING, allowNull: false },
    expira: { type: DataTypes.DATE, allowNull: false },
  },
  { tableName: 'tokens', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
