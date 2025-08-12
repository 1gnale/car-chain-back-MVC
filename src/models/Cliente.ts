import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClienteAttributes {
  idClient: number;
  persona_id: number;
}

interface ClienteCreationAttributes extends Optional<ClienteAttributes, 'idClient'> {}

class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> 
  implements ClienteAttributes {
  public idClient!: number;
  public persona_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cliente.init(
  {
    idClient: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idcliente'
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'persona',
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
