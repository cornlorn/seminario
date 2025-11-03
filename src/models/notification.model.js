import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

export const Notificacion = sequelize.define(
  'Notificacion',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tipo: {
      type: DataTypes.ENUM('Compra', 'Resultado', 'Premio', 'Sistema'),
      allowNull: false,
      comment: 'Tipo de notificación',
    },
    asunto: { type: DataTypes.STRING(255), allowNull: false, comment: 'Título de la notificación' },
    mensaje: { type: DataTypes.TEXT, allowNull: false, comment: 'Contenido de la notificación' },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Indica si el usuario leyó la notificación',
    },
    enviada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Indica si se envió el correo electrónico',
    },
    referencia: { type: DataTypes.STRING, allowNull: true, comment: 'ID de referencia (boleto_id, sorteo_id, etc)' },
    metadata: { type: DataTypes.JSON, allowNull: true, comment: 'Información adicional en formato JSON' },
  },
  {
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
    indexes: [{ fields: ['usuario'] }, { fields: ['tipo'] }, { fields: ['leida'] }, { fields: ['creado'] }],
  },
);
