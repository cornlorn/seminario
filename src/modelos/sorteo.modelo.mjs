import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Sorteo = sequelize.define(
  'Sorteo',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    modalidad: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'modalidades', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    fecha: { type: DataTypes.DATEONLY, allowNull: false, comment: 'Fecha del sorteo (YYYY-MM-DD)' },
    hora: { type: DataTypes.TIME, allowNull: false, comment: 'Hora del sorteo (HH:MM:SS)' },
    fecha_sorteo: { type: DataTypes.DATE, allowNull: false, comment: 'Fecha y hora completa del sorteo' },
    fecha_cierre_compras: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha y hora de cierre de compras (15 min antes del sorteo)',
    },
    numero_ganador: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: 'Número ganador del sorteo (00-99), null hasta que se sortea',
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Abierto', 'Cerrado', 'Finalizado', 'Cancelado'),
      defaultValue: 'Pendiente',
      allowNull: false,
      comment:
        'Pendiente: No iniciado | Abierto: Acepta compras | Cerrado: No acepta compras | Finalizado: Sorteado | Cancelado: Anulado',
    },
    total_boletos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Total de boletos vendidos en este sorteo',
    },
    total_apostado: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
      comment: 'Monto total apostado en este sorteo',
    },
    total_premios: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: true,
      comment: 'Monto total pagado en premios',
    },
  },
  {
    tableName: 'sorteos',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
    indexes: [{ fields: ['fecha_sorteo'] }, { fields: ['estado'] }, { fields: ['modalidad'] }],
  },
);
