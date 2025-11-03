import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

export const Boleto = sequelize.define(
  'Boleto',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    jugador: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'jugadores', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    sorteo: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'sorteos', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    numero_seleccionado: {
      type: DataTypes.STRING(3),
      allowNull: false,
      comment: 'Número elegido por el jugador (00-99 para Diaria, 000-999 para Jugá Tres)',
    },
    monto_apostado: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: 'Monto apostado en este boleto' },
    monto_ganado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Monto ganado si el boleto es ganador',
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Ganador', 'Perdedor', 'Expirado', 'Cancelado'),
      defaultValue: 'Activo',
      allowNull: false,
      comment: 'Activo: En espera | Ganador: Acertó | Perdedor: No acertó | Expirado: Venció | Cancelado: Anulado',
    },
    fecha_compra: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora de compra del boleto',
    },
  },
  {
    tableName: 'boletos',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
    indexes: [
      { fields: ['jugador'] },
      { fields: ['sorteo'] },
      { fields: ['estado'] },
      { fields: ['numero_seleccionado'] },
    ],
  },
);
