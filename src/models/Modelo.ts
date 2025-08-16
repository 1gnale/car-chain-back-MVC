import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ModeloAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  marca_id: number;
  activo: boolean;
}

interface ModeloCreationAttributes extends Optional<ModeloAttributes, "id"> {}

class Modelo
  extends Model<ModeloAttributes, ModeloCreationAttributes>
  implements ModeloAttributes
{
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public marca_id!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Modelo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idmodelo",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombremodelo",
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "descripcionmodelo",
    },
    marca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "marca",
        key: "idmarca",
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
    tableName: "modelo",
    timestamps: false,
  }
);

export default Modelo;
