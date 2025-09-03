import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PagoAttributes {
  id: number;
  total: number;
  fecha: Date;
  hora: string;
  poliza_numero: number;
  // Campos de MercadoPago
  mp_payment_id?: string;
  mp_status?: string;
  mp_status_detail?: string;
  mp_external_reference?: string;
  mp_payment_method_id?: string;
  mp_payment_type_id?: string;
  mp_preference_id?: string;
}

interface PagoCreationAttributes extends Optional<PagoAttributes, "id"> {}

class Pago
  extends Model<PagoAttributes, PagoCreationAttributes>
  implements PagoAttributes
{
  public id!: number;
  public total!: number;
  public fecha!: Date;
  public hora!: string;
  public poliza_numero!: number;
  // Campos de MercadoPago
  public mp_payment_id?: string;
  public mp_status?: string;
  public mp_status_detail?: string;
  public mp_external_reference?: string;
  public mp_payment_method_id?: string;
  public mp_payment_type_id?: string;
  public mp_preference_id?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pago.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "idpago",
    },
    total: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      field: "totalpago",
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fechapago",
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "horapago",
    },
    poliza_numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "poliza_num",
      references: {
        model: "poliza",
        key: "numeropoliza",
      },
    },
    // Campos de MercadoPago
    mp_payment_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "mp_payment_id",
    },
    mp_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "mp_status",
    },
    mp_status_detail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "mp_status_detail",
    },
    mp_external_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "mp_external_reference",
    },
    mp_payment_method_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "mp_payment_method_id",
    },
    mp_payment_type_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "mp_payment_type_id",
    },
    mp_preference_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "mp_preference_id",
    },
  },
  {
    sequelize,
    tableName: "pago",
    timestamps: false,
  }
);

export default Pago;
