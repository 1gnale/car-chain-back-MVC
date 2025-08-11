import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Modelo from './Modelo';

interface VersionAttributes {
  idversion: number;
  nombreversion: string;
  descripcionversion: string;
  preciomercado: number;
  preciomercadognc: number;
  modelo_id: number;
}

interface VersionCreationAttributes extends Optional<VersionAttributes, 'idversion'> {}

class Version extends Model<VersionAttributes, VersionCreationAttributes> 
  implements VersionAttributes {
  public idversion!: number;
  public nombreversion!: string;
  public descripcionversion!: string;
  public preciomercado!: number;
  public preciomercadognc!: number;
  public modelo_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Version.init(
  {
    idversion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombreversion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcionversion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    preciomercado: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
    },
    preciomercadognc: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
    },
    modelo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Modelo,
        key: 'idmodelo',
      },
    },
  },
  {
    sequelize,
    tableName: 'version',
    timestamps: true,
  }
);

export default Version;
