import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export enum EstadoPoliza {
  PENDIENTE = "PENDIENTE",
  EN_REVISION = "EN_REVISIÓN",
  RECHAZADA = "RECHAZADA",
  APROBADA = "APROBADA",
  VIGENTE = "VIGENTE",
  IMPAGA = "IMPAGA",
  VENCIDA = "VENCIDA",
  CANCELADA = "CANCELADA",
}

interface PolizaAttributes {
  numero_poliza: number;
  usuario_legajo?: number;
  documentacion_id: number;
  lineaCotizacion_id: number;
  periodoPago_id?: number;
  tipoContratacion_id?: number;
  precioPolizaActual?: number;
  montoAsegurado?: number;
  fechaContratacion?: Date;
  horaContratacion?: string;
  fechaVencimiento?: Date;
  fechaCancelacion?: Date;
  fechaDePago?: Date;
  hashContrato?: string;
  renovacionAutomatica: boolean;
  estadoPoliza: EstadoPoliza;
}

interface PolizaCreationAttributes
  extends Optional<PolizaAttributes, "numero_poliza"> {}

class Poliza
  extends Model<PolizaAttributes, PolizaCreationAttributes>
  implements PolizaAttributes
{
  public numero_poliza!: number;
  public usuario_legajo?: number;
  public documentacion_id!: number;
  public lineaCotizacion_id!: number;
  public periodoPago_id?: number;
  public tipoContratacion_id?: number;
  public precioPolizaActual?: number;
  public montoAsegurado?: number;
  public fechaContratacion?: Date;
  public horaContratacion?: string;
  public fechaVencimiento?: Date;
  public fechaCancelacion?: Date;
  public fechaDePago?: Date;

  public hashContrato?: string;
  public renovacionAutomatica!: boolean;
  public estadoPoliza!: EstadoPoliza;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Poliza.init(
  {
    numero_poliza: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "numeropoliza",
    },
    usuario_legajo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuario",
        key: "legajo",
      },
    },
    documentacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "documentacion",
        key: "iddocumentacion",
      },
    },
    lineaCotizacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "lineacotizacion_id",
      references: {
        model: "lineacotizacion",
        key: "idlineacotizacion",
      },
    },
    periodoPago_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "periodopago_id",
      references: {
        model: "periodopago",
        key: "idperiodopago",
      },
    },
    tipoContratacion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "tipocontratacion_id",
      references: {
        model: "tipocontratacion",
        key: "idtipocontratacion",
      },
    },
    precioPolizaActual: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      field: "preciopolizaactual",
    },
    montoAsegurado: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      field: "montoasegurado",
    },
    fechaContratacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fec_cont_poliza",
    },
    horaContratacion: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "hora_cont_poliza",
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fec_venc_poliza",
    },
    fechaCancelacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fec_canc_poliza",
    },
    fechaDePago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fec_pago_poliza",
    },
    hashContrato: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: "hash_contrato",
    },
    renovacionAutomatica: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "auto_renov_poliza",
    },
    estadoPoliza: {
      type: DataTypes.ENUM(...Object.values(EstadoPoliza)),
      allowNull: false,
      defaultValue: EstadoPoliza.PENDIENTE,
      field: "estadopoliza",
    },
  },
  {
    sequelize,
    tableName: "poliza",
    timestamps: false,
  }
);

export default Poliza;
