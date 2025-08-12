import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum EstadoSiniestro {
  PENDIENTE = 'PENDIENTE',
  RECHAZADA = 'RECHAZADA',
  APROBADA = 'APROBADA'
}

interface SiniestroAttributes {
  id: number;
  fechaSiniestro: Date;
  horaSiniestro: string;
  usuario_legajo: string;
  poliza_numero: number;
  estado: EstadoSiniestro;
  fotoDenuncia: Buffer;
  fotoVehiculo: Buffer;
}

interface SiniestroCreationAttributes extends Optional<SiniestroAttributes, 'id'> {}

class Siniestro extends Model<SiniestroAttributes, SiniestroCreationAttributes> 
  implements SiniestroAttributes {
  public id!: number;
  public fechaSiniestro!: Date;
  public horaSiniestro!: string;
  public usuario_legajo!: string;
  public poliza_numero!: number;
  public estado!: EstadoSiniestro;
  public fotoDenuncia!: Buffer;
  public fotoVehiculo!: Buffer;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Siniestro.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idsiniestro'
    },
    fechaSiniestro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fechasiniestro'
    },
    horaSiniestro: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'horasiniestro'
    },
    usuario_legajo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'legajo',
      },
    },
    poliza_numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'poliza_num',
      references: {
        model: 'poliza',
        key: 'numeropoliza',
      },
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(EstadoSiniestro)),
      allowNull: false,
      field: 'estadosiniestro'
    },
    fotoDenuncia: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
      field: 'fotodenuncia'
    },
    fotoVehiculo: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
      field: 'fotovehiculo'
    },
  },
  {
    sequelize,
    tableName: 'siniestro',
    timestamps: true,
  }
);

export default Siniestro;
