import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConfigLocalidadAttributes {
  id: number;
  nombre: string;
  descuento?: number;
  ganancia?: number;
  recargo?: number;
  activo: boolean;
  localidad_id: number;
}

interface ConfigLocalidadCreationAttributes extends Optional<ConfigLocalidadAttributes, 'id'> {}

class ConfigLocalidad extends Model<ConfigLocalidadAttributes, ConfigLocalidadCreationAttributes> 
  implements ConfigLocalidadAttributes {
  public id!: number;
  public nombre!: string;
  public descuento?: number;
  public ganancia?: number;
  public recargo?: number;
  public activo!: boolean;
  public localidad_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConfigLocalidad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idconfiglocalidad'
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombrecl'
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'descuentocl'
    },
    ganancia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'gananciacl'
    },
    recargo: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      field: 'recargocl'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'activocl'
    },
    localidad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'localidad',
        key: 'idLocalidad',
      },
    },
  },
  {
    sequelize,
    tableName: 'configuracionlocalidad',
    timestamps: true,
  }
);

export default ConfigLocalidad;
