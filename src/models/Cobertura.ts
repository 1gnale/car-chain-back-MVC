import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CoberturaAttributes {
  idcobertura: number;
  nombrecobertura: string;
  descripcioncobertura: string;
  recargoporatraso: number;
  activocobertura: boolean;
}

interface CoberturaCreationAttributes extends Optional<CoberturaAttributes, 'idcobertura'> {}

class Cobertura extends Model<CoberturaAttributes, CoberturaCreationAttributes> 
  implements CoberturaAttributes {
  public idcobertura!: number;
  public nombrecobertura!: string;
  public descripcioncobertura!: string;
  public recargoporatraso!: number;
  public activocobertura!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cobertura.init(
  {
    idcobertura: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombrecobertura: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcioncobertura: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    recargoporatraso: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activocobertura: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'cobertura',
    timestamps: true,
  }
);

export default Cobertura;
