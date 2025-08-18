import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface LocalidadAttributes {
  id: number;
  descripcion: string;
  codigoPostal: string;
  provincia_id: number;
  activo: boolean;
}

interface LocalidadCreationAttributes
  extends Optional<LocalidadAttributes, "id"> {}

class Localidad
  extends Model<LocalidadAttributes, LocalidadCreationAttributes>
  implements LocalidadAttributes
{
  public id!: number;
  public descripcion!: string;
  public codigoPostal!: string;
  public provincia_id!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Localidad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idLocalidad",
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "descripcionlocalidad",
    },
    codigoPostal: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "codigopostal",
    },
    provincia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "provincia",
        key: "idprovincia",
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
    tableName: "localidad",
    timestamps: false,
  }
);

export default Localidad;
