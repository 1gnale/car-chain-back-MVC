import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MarcaAttributes {
  idmarca: number;
  nombremarca: string;
  descripcionmarca: string;
}

interface MarcaCreationAttributes extends Optional<MarcaAttributes, 'idmarca'> {}

class Marca extends Model<MarcaAttributes, MarcaCreationAttributes> 
  implements MarcaAttributes {
  public idmarca!: number;
  public nombremarca!: string;
  public descripcionmarca!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Marca.init(
  {
    idmarca: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombremarca: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcionmarca: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'marca',
    timestamps: true,
  }
);

export default Marca;
