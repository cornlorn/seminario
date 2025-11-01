import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Vendedor = sequelize.define(
  'Vendedor',
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
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(50), allowNull: false },
    telefono: { type: DataTypes.STRING(20), allowNull: false, comment: 'Teléfono de contacto del vendedor' },
    direccion: { type: DataTypes.TEXT, allowNull: true, comment: 'Dirección física del punto de venta' },
    comision_porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 2.0,
      comment: 'Porcentaje de comisión por depósitos (ej: 2.00 = 2%)',
    },
    total_depositado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total acumulado de depósitos realizados',
    },
    total_retirado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total acumulado de retiros procesados',
    },
    total_comisiones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total acumulado de comisiones ganadas',
    },
  },
  { tableName: 'vendedores', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
