import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Cliente from './Cliente';
import Version from './Version';

interface VehiculoAttributes {
  idvehiculo: number;
  cliente_id: number;
  version_id: number;
  matricula: string;
  añofabricación: number;
  numeromotor: string;
  chasis: string;
  gnc: boolean;
}

interface VehiculoCreationAttributes extends Optional<VehiculoAttributes, 'idvehiculo'> {}

class Vehiculo extends Model<VehiculoAttributes, VehiculoCreationAttributes> 
  implements VehiculoAttributes {
  public idvehiculo!: number;
  public cliente_id!: number;
  public version_id!: number;
  public matricula!: string;
  public añofabricación!: number;
  public numeromotor!: string;
  public chasis!: string;
  public gnc!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehiculo.init(
  {
    idvehiculo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente,
        key: 'idcliente',
      },
    },
    version_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Version,
        key: 'idversion',
      },
    },
    matricula: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    añofabricación: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numeromotor: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    chasis: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    gnc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'vehiculo',
    timestamps: true,
  }
);

export default Vehiculo;
