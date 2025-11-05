import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Enum para los estados de revisión
export enum EstadoRevision {
  PENDIENTE = "PENDIENTE",
  RECHAZADA = "RECHAZADA",
  APROBADA = "APROBADA",
}

interface RevisionAttributes {
  id?: number;
  fecha?: Date;
  hora?: string;
  estado?: EstadoRevision;
  usuario_legajo?: number;
  poliza_numero?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Revision extends Model<RevisionAttributes> implements RevisionAttributes {
  public id?: number;
  public fecha?: Date;
  public hora?: string;
  public estado?: EstadoRevision;
  public usuario_legajo?: number;
  public poliza_numero?: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
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
      allowNull: true,
      field: "fecharevision",
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "horarevsion",
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(EstadoRevision)),
      allowNull: true,
      defaultValue: EstadoRevision.PENDIENTE,
    },
    usuario_legajo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuario",
        key: "legajo",
      },
    },
    poliza_numero: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    timestamps: true,
  }
);

export default Revision;
