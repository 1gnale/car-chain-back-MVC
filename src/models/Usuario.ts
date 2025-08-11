import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Persona from './Persona';

export enum TipoUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  VENDEDOR = 'VENDEDOR',
  PERITO = 'PERITO',
  GESTOR_DE_SINIESTROS = 'GESTOR_DE_SINIESTROS'
}

interface UsuarioAttributes {
  legajo: string;
  persona_id: number;
  estado: boolean;
  tipousuario: TipoUsuario;
}

interface UsuarioCreationAttributes extends UsuarioAttributes {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> 
  implements UsuarioAttributes {
  public legajo!: string;
  public persona_id!: number;
  public estado!: boolean;
  public tipousuario!: TipoUsuario;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuario.init(
  {
    legajo: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      unique: true,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Persona,
        key: 'idpersona',
      },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tipousuario: {
      type: DataTypes.ENUM(...Object.values(TipoUsuario)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'usuario',
    timestamps: true,
  }
);

export default Usuario;
