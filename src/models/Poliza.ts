import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Usuario from './Usuario';

export enum EstadoPoliza {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISIÓN',
  RECHAZADA = 'RECHAZADA',
  APROBADA = 'APROBADA',
  VIGENTE = 'VIGENTE',
  IMPAGA = 'IMPAGA',
  VENCIDA = 'VENCIDA',
  CANCELADA = 'CANCELADA'
}

interface PolizaAttributes {
  numeropoliza: number;
  usuario_legajo?: string;
  documentacion_id: number;
  lineacotizacion_id: number;
  periodopago_id?: number;
  tipocontratacion_id?: number;
  preciopolizaactual: number;
  montoasegurado: number;
  fec_cont_poliza?: Date;
  hora_cont_poliza?: string;
  fec_venc_poliza?: Date;
  fec_canc_poliza?: Date;
  auto_renov_poliza: boolean;
  estadopoliza: EstadoPoliza;
}

interface PolizaCreationAttributes extends Optional<PolizaAttributes, 'numeropoliza'> {}

class Poliza extends Model<PolizaAttributes, PolizaCreationAttributes> 
  implements PolizaAttributes {
  public numeropoliza!: number;
  public usuario_legajo?: string;
  public documentacion_id!: number;
  public lineacotizacion_id!: number;
  public periodopago_id?: number;
  public tipocontratacion_id?: number;
  public preciopolizaactual!: number;
  public montoasegurado!: number;
  public fec_cont_poliza?: Date;
  public hora_cont_poliza?: string;
  public fec_venc_poliza?: Date;
  public fec_canc_poliza?: Date;
  public auto_renov_poliza!: boolean;
  public estadopoliza!: EstadoPoliza;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Poliza.init(
  {
    numeropoliza: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_legajo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: Usuario,
        key: 'legajo',
      },
    },
    documentacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lineacotizacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periodopago_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipocontratacion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    preciopolizaactual: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
    },
    montoasegurado: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
    },
    fec_cont_poliza: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    hora_cont_poliza: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fec_venc_poliza: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fec_canc_poliza: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    auto_renov_poliza: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    estadopoliza: {
      type: DataTypes.ENUM(...Object.values(EstadoPoliza)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'poliza',
    timestamps: true,
  }
);

export default Poliza;
