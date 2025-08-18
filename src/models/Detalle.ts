import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DetalleAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  porcentaje_miles: number;
  monto_fijo: number;
  activo: boolean;
}

interface DetalleCreationAttributes extends Optional<DetalleAttributes, "id"> {}

class Detalle
  extends Model<DetalleAttributes, DetalleCreationAttributes>
  implements DetalleAttributes
{
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public porcentaje_miles!: number;
  public monto_fijo!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Detalle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "iddetalle",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombredetalle",
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "descripciondetalle",
    },
    porcentaje_miles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "porcentajemiles",
    },
    monto_fijo: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      field: "montofijo",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "activodetalle",
    },
  },
  {
    sequelize,
    tableName: "detalle",
    timestamps: false,
  }
);

export default Detalle;
