import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface VehiculoAttributes {
  id: number;
  cliente_id: number;
  version_id: number;
  matricula: string;
  añoFabricacion: number;
  numeroMotor: string;
  chasis: string;
  gnc: boolean;
}

interface VehiculoCreationAttributes
  extends Optional<VehiculoAttributes, "id"> {}

class Vehiculo
  extends Model<VehiculoAttributes, VehiculoCreationAttributes>
  implements VehiculoAttributes
{
  public id!: number;
  public cliente_id!: number;
  public version_id!: number;
  public matricula!: string;
  public añoFabricacion!: number;
  public numeroMotor!: string;
  public chasis!: string;
  public gnc!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehiculo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idvehiculo",
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cliente",
        key: "idcliente",
      },
    },
    version_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "version",
        key: "idversion",
      },
    },
    matricula: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    añoFabricacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "añofabricación",
    },
    numeroMotor: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "numeromotor",
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
    tableName: "vehiculo",
    timestamps: false,
  }
);

export default Vehiculo;
