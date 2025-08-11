import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Localidad from './Localidad';

export enum TipoDocumento {
  CUIT = 'CUIT',
  CEDULA = 'CEDULA',
  DNI = 'DNI',
  LIBRETA_ENROLE = 'LIBRETA_ENROLE',
  LIBRETA_CIVICA = 'LIBRETA_CIVICA',
  PASAPORTE = 'PASAPORTE'
}

interface PersonaAttributes {
  idpersona: number;
  localidad_id: number;
  nombres: string;
  apellidos: string;
  fechanacimiento: Date;
  tipodocumento: TipoDocumento;
  documento: string;
  domicilio: string;
  correo: string;
  telefono: string;
  sexo: boolean;
  contraseña: string;
}

interface PersonaCreationAttributes extends Optional<PersonaAttributes, 'idpersona'> {}

class Persona extends Model<PersonaAttributes, PersonaCreationAttributes> 
  implements PersonaAttributes {
  public idpersona!: number;
  public localidad_id!: number;
  public nombres!: string;
  public apellidos!: string;
  public fechanacimiento!: Date;
  public tipodocumento!: TipoDocumento;
  public documento!: string;
  public domicilio!: string;
  public correo!: string;
  public telefono!: string;
  public sexo!: boolean;
  public contraseña!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Persona.init(
  {
    idpersona: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    localidad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Localidad,
        key: 'idLocalidad',
      },
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fechanacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tipodocumento: {
      type: DataTypes.ENUM(...Object.values(TipoDocumento)),
      allowNull: false,
    },
    documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    domicilio: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sexo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    contraseña: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'persona',
    timestamps: true,
  }
);

export default Persona;
