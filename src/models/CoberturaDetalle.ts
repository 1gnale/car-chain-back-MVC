import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CoberturaDetalleAttributes {
  id: number;
  cobertura_id: number;
  detalle_id: number;
  aplica: boolean;
}

interface CoberturaDetalleCreationAttributes
  extends Optional<CoberturaDetalleAttributes, "id"> {}

class CoberturaDetalle
  extends Model<CoberturaDetalleAttributes, CoberturaDetalleCreationAttributes>
  implements CoberturaDetalleAttributes
{
  public id!: number;
  public cobertura_id!: number;
  public detalle_id!: number;
  public aplica!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CoberturaDetalle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idcoberturadetalle",
    },
    cobertura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cobertura",
        key: "idcobertura",
      },
    },
    detalle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "detalle",
        key: "iddetalle",
      },
    },
    aplica: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "coberturadetalle",
    timestamps: false,
  }
);

export default CoberturaDetalle;
