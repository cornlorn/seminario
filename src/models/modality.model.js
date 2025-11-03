import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

export const Modalidad = sequelize.define(
  'Modalidad',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    juego: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'juegos', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    precio_minimo: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 5.0 },
    multiplo_apuesta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 5.0,
      comment: 'Múltiplo permitido para apuestas (ej: 5, 10, 15)',
    },
    multiplicador_premio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      comment: 'Multiplicador del monto apostado para calcular premio',
    },
    rango_numero_min: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rango_numero_max: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 99 },
    estado: { type: DataTypes.ENUM('Activo', 'Inactivo'), defaultValue: 'Activo', allowNull: false },
  },
  { tableName: 'modalidades', timestamps: true, createdAt: 'creado', updatedAt: 'actualizado' },
);
