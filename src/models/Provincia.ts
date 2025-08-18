import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ProvinciaAttributes {
  id: number;
  descripcion: string;
  activo: boolean;
}

interface ProvinciaCreationAttributes
  extends Optional<ProvinciaAttributes, "id"> {}

class Provincia
  extends Model<ProvinciaAttributes, ProvinciaCreationAttributes>
  implements ProvinciaAttributes
{
  public id!: number;
  public descripcion!: string;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Provincia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idprovincia",
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "descripcionprovincia",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "provincia",
    timestamps: false,
  }
);

export default Provincia;
