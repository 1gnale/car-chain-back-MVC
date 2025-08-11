import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Persona from './Persona';

interface ClienteAttributes {
  idcliente: number;
  persona_id: number;
}

interface ClienteCreationAttributes extends Optional<ClienteAttributes, 'idcliente'> {}

class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> 
  implements ClienteAttributes {
  public idcliente!: number;
  public persona_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cliente.init(
  {
    idcliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Persona,
        key: 'idpersona',
      },
    },
  },
  {
    sequelize,
    tableName: 'cliente',
    timestamps: true,
  }
);

export default Cliente;
