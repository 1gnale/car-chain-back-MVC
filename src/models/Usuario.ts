import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export enum TipoUsuario {
  ADMINISTRADOR = "ADMINISTRADOR",
  VENDEDOR = "VENDEDOR",
  PERITO = "PERITO",
  GESTOR_DE_SINIESTROS = "GESTOR_DE_SINIESTROS",
}

interface UsuarioAttributes {
  legajo: number;
  persona_id: number;
  activo: boolean;
  tipoUsuario: TipoUsuario;
}

interface UsuarioCreationAttributes
  extends Optional<UsuarioAttributes, "legajo"> {}

class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public legajo!: number;
  public persona_id!: number;
  public activo!: boolean;
  public tipoUsuario!: TipoUsuario;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuario.init(
  {
    legajo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "persona",
        key: "idpersona",
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    tipoUsuario: {
      type: DataTypes.ENUM(...Object.values(TipoUsuario)),
      allowNull: false,
      field: "tipousuario",
    },
  },
  {
    sequelize,
    tableName: "usuario",
    timestamps: false,
  }
);

export default Usuario;
