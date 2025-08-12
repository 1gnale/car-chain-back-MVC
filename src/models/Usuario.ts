import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum TipoUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  VENDEDOR = 'VENDEDOR',
  PERITO = 'PERITO',
  GESTOR_DE_SINIESTROS = 'GESTOR_DE_SINIESTROS'
}

interface UsuarioAttributes {
  idUsuario: number;
  legajo: string;
  persona_id: number;
  estado: string;
  tipoUsuario: TipoUsuario;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'idUsuario'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> 
  implements UsuarioAttributes {
  public idUsuario!: number;
  public legajo!: string;
  public persona_id!: number;
  public estado!: string;
  public tipoUsuario!: TipoUsuario;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idusuario'
    },
    legajo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'persona',
        key: 'idpersona',
      },
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVO'
    },
    tipoUsuario: {
      type: DataTypes.ENUM(...Object.values(TipoUsuario)),
      allowNull: false,
      field: 'tipousuario'
    },
  },
  {
    sequelize,
    tableName: 'usuario',
    timestamps: true,
  }
);

export default Usuario;
