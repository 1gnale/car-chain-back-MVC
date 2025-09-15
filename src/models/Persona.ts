import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export enum TipoDocumento {
  CUIT = "CUIT",
  CEDULA = "CEDULA",
  DNI = "DNI",
  LIBRETA_ENROLE = "LIBRETA_ENROLE",
  LIBRETA_CIVICA = "LIBRETA_CIVICA",
  PASAPORTE = "PASAPORTE",
}

export enum sexo {
  MASCULINO = "Masculino",
  FEMENINO = "Femenino",
}

interface PersonaAttributes {
  id: number;
  localidad_id: number;
  nombres: string;
  apellido: string;
  fechaNacimiento: Date;
  tipoDocumento: TipoDocumento;
  documento: string;
  domicilio: string;
  correo: string;
  telefono: string;
  sexo: string;
}

interface PersonaCreationAttributes extends Optional<PersonaAttributes, "id"> {}

class Persona
  extends Model<PersonaAttributes, PersonaCreationAttributes>
  implements PersonaAttributes
{
  public id!: number;
  public localidad_id!: number;
  public nombres!: string;
  public apellido!: string;
  public fechaNacimiento!: Date;
  public tipoDocumento!: TipoDocumento;
  public documento!: string;
  public domicilio!: string;
  public correo!: string;
  public telefono!: string;
  public sexo!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Persona.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idpersona",
    },
    localidad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "localidad",
        key: "idLocalidad",
      },
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "apellidos",
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fechanacimiento",
    },
    tipoDocumento: {
      type: DataTypes.ENUM(...Object.values(TipoDocumento)),
      allowNull: false,
      field: "tipodocumento",
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
      type: DataTypes.ENUM(...Object.values(sexo)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "persona",
    timestamps: false,
  }
);

export default Persona;
