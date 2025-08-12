import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CoberturaAttributes {
  id_cobertura: number;
  nombre: string;
  descripcion: string;
  recargoPorAtraso: number;
  activo: boolean;
}

interface CoberturaCreationAttributes extends Optional<CoberturaAttributes, 'id_cobertura'> {}

class Cobertura extends Model<CoberturaAttributes, CoberturaCreationAttributes> 
  implements CoberturaAttributes {
  public id_cobertura!: number;
  public nombre!: string;
  public descripcion!: string;
  public recargoPorAtraso!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cobertura.init(
  {
    id_cobertura: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idcobertura'
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombrecobertura'
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'descripcioncobertura'
    },
    recargoPorAtraso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'recargoporatraso'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'activocobertura'
    },
  },
  {
    sequelize,
    tableName: 'cobertura',
    timestamps: true,
  }
);

export default Cobertura;
