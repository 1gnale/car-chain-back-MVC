import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PeriodoPagoAttributes {
  id: number;
  nombre: string;
  cantidadMeses: number;
  descuento: number;
  activo: boolean;
}

interface PeriodoPagoCreationAttributes extends Optional<PeriodoPagoAttributes, 'id'> {}

class PeriodoPago extends Model<PeriodoPagoAttributes, PeriodoPagoCreationAttributes> 
  implements PeriodoPagoAttributes {
  public id!: number;
  public nombre!: string;
  public cantidadMeses!: number;
  public descuento!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PeriodoPago.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idperiodopago'
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombreperiodopago'
    },
    cantidadMeses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidadmesespago'
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'descuentoperiodopago'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize,
    tableName: 'periodopago',
    timestamps: true,
  }
);

export default PeriodoPago;
