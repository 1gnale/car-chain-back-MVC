import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ConfigAntiguedadAttributes {
  id: number;
  nombre: string;
  minima: number;
  maxima: number;
  descuento?: number;
  ganancia?: number;
  recargo?: number;
  activo: boolean;
}

interface ConfigAntiguedadCreationAttributes
  extends Optional<ConfigAntiguedadAttributes, "id"> {}

class ConfigAntiguedad
  extends Model<ConfigAntiguedadAttributes, ConfigAntiguedadCreationAttributes>
  implements ConfigAntiguedadAttributes
{
  public id!: number;
  public nombre!: string;
  public minima!: number;
  public maxima!: number;
  public descuento?: number;
  public ganancia?: number;
  public recargo?: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConfigAntiguedad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idconfigantiguedad",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombreca",
    },
    minima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "minimaca",
    },
    maxima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "maximaca",
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "descuentoca",
    },
    ganancia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "gananciaca",
    },
    recargo: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      field: "recargoca",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "activoca",
    },
  },
  {
    sequelize,
    tableName: "configuracionantiguedad",
    timestamps: false,
  }
);

export default ConfigAntiguedad;
