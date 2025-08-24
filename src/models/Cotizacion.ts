import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CotizacionAttributes {
  id: number;
  fechaCreacion: Date;
  fechaVencimiento: Date;
  vehiculo_id: number;
  configuracionLocalidad_id?: number;
  configuracionEdad_id?: number;
  configuracionAntiguedad_id?: number;
}

interface CotizacionCreationAttributes
  extends Optional<CotizacionAttributes, "id"> {}

class Cotizacion
  extends Model<CotizacionAttributes, CotizacionCreationAttributes>
  implements CotizacionAttributes
{
  public id!: number;
  public fechaCreacion!: Date;
  public fechaVencimiento!: Date;
  public vehiculo_id!: number;
  public configuracionLocalidad_id?: number;
  public configuracionEdad_id?: number;
  public configuracionAntiguedad_id?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cotizacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idcotizacion",
    },
    fechaCreacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fechacreacioncotizacion",
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fechavencimientocotizacion",
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehiculo",
        key: "idvehiculo",
      },
    },
    configuracionLocalidad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "configlocalidad_id",
      references: {
        model: "configuracionlocalidad",
        key: "configuracionLocalidad_id",
      },
    },
    configuracionEdad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "configedad_id",
      references: {
        model: "configuracionedad",
        key: "idconfiguracionedad",
      },
    },
    configuracionAntiguedad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "configantiguedad_id",
      references: {
        model: "configuracionantiguedad",
        key: "configuracionAntiguedad_id",
      },
    },
  },
  {
    sequelize,
    tableName: "cotizacion",
    timestamps: false,
  }
);

export default Cotizacion;
