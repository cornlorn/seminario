import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

export const Billetera = sequelize.define(
  'Billetera',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    jugador: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      references: { model: 'jugadores', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    saldo: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: 'billeteras', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
