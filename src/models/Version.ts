import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface VersionAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  precio_mercado: number;
  precio_mercado_gnc: number;
  modelo_id: number;
  activo: boolean;
}

interface VersionCreationAttributes extends Optional<VersionAttributes, "id"> {}

class Version
  extends Model<VersionAttributes, VersionCreationAttributes>
  implements VersionAttributes
{
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public precio_mercado!: number;
  public precio_mercado_gnc!: number;
  public modelo_id!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Version.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idversion",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombreversion",
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "descripcionversion",
    },
    precio_mercado: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      field: "preciomercado",
    },
    precio_mercado_gnc: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      field: "preciomercadognc",
    },
    modelo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modelo",
        key: "idmodelo",
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "version",
    timestamps: false,
  }
);

export default Version;
