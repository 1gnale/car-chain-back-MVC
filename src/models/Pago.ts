import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PagoAttributes {
  id: number;
  total: number;
  fecha: Date;
  hora: string;
  poliza_numero: number;
}

interface PagoCreationAttributes extends Optional<PagoAttributes, 'id'> {}

class Pago extends Model<PagoAttributes, PagoCreationAttributes> 
  implements PagoAttributes {
  public id!: number;
  public total!: number;
  public fecha!: Date;
  public hora!: string;
  public poliza_numero!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pago.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idpago'
    },
    total: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      field: 'totalpago'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fechapago'
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'horapago'
    },
    poliza_numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'poliza_num',
      references: {
        model: 'poliza',
        key: 'numeropoliza',
      },
    },
  },
  {
    sequelize,
    tableName: 'pago',
    timestamps: true,
  }
);

export default Pago;
