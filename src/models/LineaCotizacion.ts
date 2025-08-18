import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface LineaCotizacionAttributes {
  id: number;
  monto: number;
  cotizacion_id: number;
  cobertura_id: number;
}

interface LineaCotizacionCreationAttributes
  extends Optional<LineaCotizacionAttributes, "id"> {}

class LineaCotizacion
  extends Model<LineaCotizacionAttributes, LineaCotizacionCreationAttributes>
  implements LineaCotizacionAttributes
{
  public id!: number;
  public monto!: number;
  public cotizacion_id!: number;
  public cobertura_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LineaCotizacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idlineacotizacion",
    },
    monto: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
    },
    cotizacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cotizacion",
        key: "idcotizacion",
      },
    },
    cobertura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cobertura",
        key: "idcobertura",
      },
    },
  },
  {
    sequelize,
    tableName: "lineacotizacion",
    timestamps: false,
  }
);

export default LineaCotizacion;
