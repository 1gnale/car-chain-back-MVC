import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TipoContratacionAttributes {
  id: number;
  nombre: string;
  cantidadMeses: number;
  activo: boolean;
}

interface TipoContratacionCreationAttributes
  extends Optional<TipoContratacionAttributes, "id"> {}

class TipoContratacion
  extends Model<TipoContratacionAttributes, TipoContratacionCreationAttributes>
  implements TipoContratacionAttributes
{
  public id!: number;
  public nombre!: string;
  public cantidadMeses!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TipoContratacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idtipocontratacion",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombrecontratacion",
    },
    cantidadMeses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cantidadmesescontratacion",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "tipocontratacion",
    timestamps: false,
  }
);

export default TipoContratacion;
