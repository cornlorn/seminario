import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Jugador = sequelize.define(
  'Jugador',
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
    apellido: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: 'jugadores', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
