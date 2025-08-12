import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConfigEdadAttributes {
  id: number;
  nombre: string;
  minima: number;
  maxima: number;
  descuento?: number;
  ganancia?: number;
  recargo?: number;
  activo: boolean;
}

interface ConfigEdadCreationAttributes extends Optional<ConfigEdadAttributes, 'id'> {}

class ConfigEdad extends Model<ConfigEdadAttributes, ConfigEdadCreationAttributes> 
  implements ConfigEdadAttributes {
  public id!: number;
  public nombre!: string;
  public minima!: number;
  public maxima!: number;
  public descuento?: number;
  public ganancia?: number;
  public recargo?: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConfigEdad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idconfigedad'
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombrece'
    },
    minima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'minimace'
    },
    maxima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'maximace'
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'descuentoce'
    },
    ganancia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'gananciace'
    },
    recargo: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      field: 'recargoce'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'activoce'
    },
  },
  {
    sequelize,
    tableName: 'configuracionedad',
    timestamps: true,
  }
);

export default ConfigEdad;
