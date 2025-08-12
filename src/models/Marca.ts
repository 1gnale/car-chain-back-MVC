import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MarcaAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface MarcaCreationAttributes extends Optional<MarcaAttributes, 'id'> {}

class Marca extends Model<MarcaAttributes, MarcaCreationAttributes> 
  implements MarcaAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Marca.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idmarca'
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombremarca'
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'descripcionmarca'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize,
    tableName: 'marca',
    timestamps: true,
  }
);

export default Marca;
