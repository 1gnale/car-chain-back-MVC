import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProvinciaAttributes {
  idprovincia: number;
  descripcionprovincia: string;
}

interface ProvinciaCreationAttributes extends Optional<ProvinciaAttributes, 'idprovincia'> {}

class Provincia extends Model<ProvinciaAttributes, ProvinciaCreationAttributes> 
  implements ProvinciaAttributes {
  public idprovincia!: number;
  public descripcionprovincia!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Provincia.init(
  {
    idprovincia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcionprovincia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'provincia',
    timestamps: true,
  }
);

export default Provincia;
