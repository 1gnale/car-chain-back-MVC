import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DocumentacionAttributes {
  id: number;
  fotoFrontal: Buffer;
  fotoTrasera: Buffer;
  fotoLateral1: Buffer;
  fotoLateral2: Buffer;
  fotoTecho: Buffer;
  cedulaVerde: Buffer;
}

interface DocumentacionCreationAttributes
  extends Optional<DocumentacionAttributes, "id"> {}

class Documentacion
  extends Model<DocumentacionAttributes, DocumentacionCreationAttributes>
  implements DocumentacionAttributes
{
  public id!: number;
  public fotoFrontal!: Buffer;
  public fotoTrasera!: Buffer;
  public fotoLateral1!: Buffer;
  public fotoLateral2!: Buffer;
  public fotoTecho!: Buffer;
  public cedulaVerde!: Buffer;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Documentacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "iddocumentacion",
    },
    fotoFrontal: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
      field: "fotofrontal",
    },
    fotoTrasera: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
      field: "fototrasera",
    },
    fotoLateral1: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
      field: "fotolateraluno",
    },
    fotoLateral2: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
      field: "fotolateraldos",
    },
    fotoTecho: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
      field: "fototecho",
    },
    cedulaVerde: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
      field: "cedulaverde",
    },
  },
  {
    sequelize,
    tableName: "documentacion",
    timestamps: false,
  }
);

export default Documentacion;
