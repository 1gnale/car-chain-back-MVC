import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Marca from './Marca';

interface ModeloAttributes {
  idmodelo: number;
  nombremodelo: string;
  descripcionmodelo: string;
  marca_id: number;
}

interface ModeloCreationAttributes extends Optional<ModeloAttributes, 'idmodelo'> {}

class Modelo extends Model<ModeloAttributes, ModeloCreationAttributes> 
  implements ModeloAttributes {
  public idmodelo!: number;
  public nombremodelo!: string;
  public descripcionmodelo!: string;
  public marca_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Modelo.init(
  {
    idmodelo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombremodelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcionmodelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    marca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Marca,
        key: 'idmarca',
      },
    },
  },
  {
    sequelize,
    tableName: 'modelo',
    timestamps: true,
  }
);

export default Modelo;
