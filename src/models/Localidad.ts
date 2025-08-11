import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Provincia from './Provincia';

interface LocalidadAttributes {
  idLocalidad: number;
  descripcionlocalidad: string;
  codigopostal: string;
  provincia_id: number;
}

interface LocalidadCreationAttributes extends Optional<LocalidadAttributes, 'idLocalidad'> {}

class Localidad extends Model<LocalidadAttributes, LocalidadCreationAttributes> 
  implements LocalidadAttributes {
  public idLocalidad!: number;
  public descripcionlocalidad!: string;
  public codigopostal!: string;
  public provincia_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Localidad.init(
  {
    idLocalidad: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcionlocalidad: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    codigopostal: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    provincia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Provincia,
        key: 'idprovincia',
      },
    },
  },
  {
    sequelize,
    tableName: 'localidad',
    timestamps: true,
  }
);

export default Localidad;
