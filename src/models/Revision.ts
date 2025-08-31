import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Enum para los estados de revisión
export enum EstadoRevision {
  PENDIENTE = "PENDIENTE",
  RECHAZADA = "RECHAZADA",
  APROBADA = "APROBADA",
}

interface RevisionAttributes {
  id: number;
  fecha: Date;
  hora: string;
  estado: EstadoRevision;
  usuario_legajo: string;
  poliza_numero: number;
}

interface RevisionCreationAttributes
  extends Optional<RevisionAttributes, "id"> {}

class Revision
  extends Model<RevisionAttributes, RevisionCreationAttributes>
  implements RevisionAttributes
{
  public id!: number;
  public fecha!: Date;
  public hora!: string;
  public estado!: EstadoRevision;
  public usuario_legajo!: string;
  public poliza_numero!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Revision.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idrevision",
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecharevision",
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "horarevsion",
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(EstadoRevision)),
      allowNull: false,
      defaultValue: EstadoRevision.PENDIENTE,
    },
    usuario_legajo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "usuario",
        key: "legajo",
      },
    },
    poliza_numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "poliza_num",
      references: {
        model: "poliza",
        key: "numeropoliza",
      },
    },
  },
  {
    sequelize,
    tableName: "revision",
    timestamps: false,
  }
);

export default Revision;
