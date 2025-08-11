import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Vehiculo from './Vehiculo';

interface CotizacionAttributes {
  idcotizacion: number;
  vehiculo_id: number;
  configlocalidad_id?: number;
  configedad_id?: number;
  configantiguedad_id?: number;
  fechacreacioncotizacion: Date;
  fechavencimientocotizacion: Date;
}

interface CotizacionCreationAttributes extends Optional<CotizacionAttributes, 'idcotizacion'> {}

class Cotizacion extends Model<CotizacionAttributes, CotizacionCreationAttributes> 
  implements CotizacionAttributes {
  public idcotizacion!: number;
  public vehiculo_id!: number;
  public configlocalidad_id?: number;
  public configedad_id?: number;
  public configantiguedad_id?: number;
  public fechacreacioncotizacion!: Date;
  public fechavencimientocotizacion!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cotizacion.init(
  {
    idcotizacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehiculo,
        key: 'idvehiculo',
      },
    },
    configlocalidad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    configedad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    configantiguedad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fechacreacioncotizacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechavencimientocotizacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'cotizacion',
    timestamps: true,
  }
);

export default Cotizacion;
