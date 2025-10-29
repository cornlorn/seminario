import { DataTypes } from 'sequelize';
import { sequelize } from '../configuraciones/database.mjs';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    correo: { type: DataTypes.STRING, allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING, allowNull: false },
    rol: {
      type: DataTypes.ENUM('Administrador', 'Vendedor', 'Jugador'),
      defaultValue: 'Jugador',
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
  },
);
