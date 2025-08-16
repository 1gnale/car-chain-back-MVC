// Archivo para definir las relaciones entre modelos
import Provincia from "./Provincia";
import Localidad from "./Localidad";
import Persona from "./Persona";
import Usuario from "./Usuario";
import Cliente from "./Cliente";
import Marca from "./Marca";
import Modelo from "./Modelo";
import Version from "./Version";
import Vehiculo from "./Vehiculo";
import ConfigEdad from "./ConfigEdad";
import ConfigAntiguedad from "./ConfigAntiguedad";
import ConfigLocalidad from "./ConfigLocalidad";
import Cobertura from "./Cobertura";
import Detalle from "./Detalle";
import CoberturaDetalle from "./CoberturaDetalle";
import Cotizacion from "./Cotizacion";
import LineaCotizacion from "./LineaCotizacion";
import Documentacion from "./Documentacion";
import PeriodoPago from "./PeriodoPago";
import TipoContratacion from "./TipoContratacion";
import Poliza from "./Poliza";
import Pago from "./Pago";
import Siniestro from "./Siniestro";
import Revision from "./Revision";

// Relaciones entre Provincia y Localidad
Provincia.hasMany(Localidad, {
  foreignKey: "provincia_id",
  as: "localidades",
});

Localidad.belongsTo(Provincia, {
  foreignKey: "provincia_id",
  as: "provincia",
});

// Relaciones entre Localidad y Persona
Localidad.hasMany(Persona, {
  foreignKey: "localidad_id",
  as: "personas",
});

Persona.belongsTo(Localidad, {
  foreignKey: "localidad_id",
  as: "localidad",
});

// Relaciones entre Persona y Usuario
Persona.hasOne(Usuario, {
  foreignKey: "persona_id",
  as: "usuario",
});

Usuario.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
});

// Relaciones entre Persona y Cliente
Persona.hasOne(Cliente, {
  foreignKey: "persona_id",
  as: "cliente",
});

Cliente.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
});

// Relaciones entre Marca y Modelo
Marca.hasMany(Modelo, {
  foreignKey: "marca_id",
  as: "modelos",
});

Modelo.belongsTo(Marca, {
  foreignKey: "marca_id",
  as: "marca",
});

// Relaciones entre Modelo y Version
Modelo.hasMany(Version, {
  foreignKey: "modelo_id",
  as: "versiones",
});

Version.belongsTo(Modelo, {
  foreignKey: "modelo_id",
  as: "modelo",
});

// Relaciones entre Cliente y Vehiculo
Cliente.hasMany(Vehiculo, {
  foreignKey: "cliente_id",
  as: "vehiculos",
});

Vehiculo.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});

// Relaciones entre Version y Vehiculo
Version.hasMany(Vehiculo, {
  foreignKey: "version_id",
  as: "vehiculos",
});

Vehiculo.belongsTo(Version, {
  foreignKey: "version_id",
  as: "version",
});

// Relaciones entre Localidad y ConfigLocalidad
Localidad.hasMany(ConfigLocalidad, {
  foreignKey: "localidad_id",
  as: "configuraciones",
});

ConfigLocalidad.belongsTo(Localidad, {
  foreignKey: "localidad_id",
  as: "localidad",
});

// Relaciones entre Cobertura y Detalle (muchos a muchos)
Cobertura.belongsToMany(Detalle, {
  through: CoberturaDetalle,
  foreignKey: "cobertura_id",
  otherKey: "detalle_id",
  as: "detalles",
});

Detalle.belongsToMany(Cobertura, {
  through: CoberturaDetalle,
  foreignKey: "detalle_id",
  otherKey: "cobertura_id",
  as: "coberturas",
});

CoberturaDetalle.belongsTo(Cobertura, {
  foreignKey: "cobertura_id",
  as: "cobertura",
});

CoberturaDetalle.belongsTo(Detalle, {
  foreignKey: "detalle_id",
  as: "detalle",
});

// Relaciones de Cotizacion
Vehiculo.hasMany(Cotizacion, {
  foreignKey: "vehiculo_id",
  as: "cotizaciones",
});

Cotizacion.belongsTo(Vehiculo, {
  foreignKey: "vehiculo_id",
  as: "vehiculo",
});

ConfigLocalidad.hasMany(Cotizacion, {
  foreignKey: "configuracionLocalidad_id",
  as: "cotizaciones",
});

Cotizacion.belongsTo(ConfigLocalidad, {
  foreignKey: "configuracionLocalidad_id",
  as: "configuaracionLocalidad",
});

ConfigEdad.hasMany(Cotizacion, {
  foreignKey: "configuracionEdad_id",
  as: "cotizaciones",
});

Cotizacion.belongsTo(ConfigEdad, {
  foreignKey: "configuracionEdad_id",
  as: "configudacionEdad",
});

ConfigAntiguedad.hasMany(Cotizacion, {
  foreignKey: "configuracionAntiguedad_id",
  as: "cotizaciones",
});

Cotizacion.belongsTo(ConfigAntiguedad, {
  foreignKey: "configuracionAntiguedad_id",
  as: "configuracionAntiguedad",
});

// Relaciones de LineaCotizacion
Cotizacion.hasMany(LineaCotizacion, {
  foreignKey: "cotizacion_id",
  as: "lineas",
});

LineaCotizacion.belongsTo(Cotizacion, {
  foreignKey: "cotizacion_id",
  as: "cotizacion",
});

Cobertura.hasMany(LineaCotizacion, {
  foreignKey: "cobertura_id",
  as: "lineasCotizacion",
});

LineaCotizacion.belongsTo(Cobertura, {
  foreignKey: "cobertura_id",
  as: "cobertura",
});

// Relaciones de Poliza
LineaCotizacion.hasOne(Poliza, {
  foreignKey: "lineaContizacion_id",
  as: "poliza",
});

Poliza.belongsTo(LineaCotizacion, {
  foreignKey: "lineaContizacion_id",
  as: "lineaContizacion",
});

Documentacion.hasOne(Poliza, {
  foreignKey: "documentacion_id",
  as: "poliza",
});

Poliza.belongsTo(Documentacion, {
  foreignKey: "documentacion_id",
  as: "documentacion",
});

Usuario.hasMany(Poliza, {
  foreignKey: "usuario_legajo",
  as: "polizas",
});

Poliza.belongsTo(Usuario, {
  foreignKey: "usuario_legajo",
  as: "usuario",
});

PeriodoPago.hasMany(Poliza, {
  foreignKey: "periodoPago_id",
  as: "polizas",
});

Poliza.belongsTo(PeriodoPago, {
  foreignKey: "periodoPago_id",
  as: "periodoPago",
});

TipoContratacion.hasMany(Poliza, {
  foreignKey: "tipoContratacion_id",
  as: "polizas",
});

Poliza.belongsTo(TipoContratacion, {
  foreignKey: "tipoContratacion_id",
  as: "tipoContratacion",
});

// Relaciones de Pago
Poliza.hasMany(Pago, {
  foreignKey: "poliza_numero",
  as: "pagos",
});

Pago.belongsTo(Poliza, {
  foreignKey: "poliza_numero",
  as: "poliza",
});

// Relaciones de Siniestro
Poliza.hasMany(Siniestro, {
  foreignKey: "poliza_numero",
  as: "siniestros",
});

Siniestro.belongsTo(Poliza, {
  foreignKey: "poliza_numero",
  as: "poliza",
});

Usuario.hasMany(Siniestro, {
  foreignKey: "usuario_legajo",
  as: "siniestros",
});

Siniestro.belongsTo(Usuario, {
  foreignKey: "usuario_legajo",
  as: "usuario",
});

// Relaciones de Revision
Poliza.hasMany(Revision, {
  foreignKey: "poliza_numero",
  as: "revisiones",
});

Revision.belongsTo(Poliza, {
  foreignKey: "poliza_numero",
  as: "poliza",
});

Usuario.hasMany(Revision, {
  foreignKey: "usuario_legajo",
  as: "revisiones",
});

Revision.belongsTo(Usuario, {
  foreignKey: "usuario_legajo",
  as: "usuario",
});

export {
  Provincia,
  Localidad,
  Persona,
  Usuario,
  Cliente,
  Marca,
  Modelo,
  Version,
  Vehiculo,
  ConfigEdad,
  ConfigAntiguedad,
  ConfigLocalidad,
  Cobertura,
  Detalle,
  CoberturaDetalle,
  Cotizacion,
  LineaCotizacion,
  Documentacion,
  PeriodoPago,
  TipoContratacion,
  Poliza,
  Pago,
  Siniestro,
  Revision,
};
