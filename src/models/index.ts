// Archivo para definir las relaciones entre modelos
import Provincia from './Provincia';
import Localidad from './Localidad';
import Persona from './Persona';
import Usuario from './Usuario';
import Cliente from './Cliente';
import Marca from './Marca';
import Modelo from './Modelo';
import Version from './Version';
import Vehiculo from './Vehiculo';

// Relaciones entre Provincia y Localidad
Provincia.hasMany(Localidad, {
  foreignKey: 'provincia_id',
  as: 'localidades'
});

Localidad.belongsTo(Provincia, {
  foreignKey: 'provincia_id',
  as: 'provincia'
});

// Relaciones entre Localidad y Persona
Localidad.hasMany(Persona, {
  foreignKey: 'localidad_id',
  as: 'personas'
});

Persona.belongsTo(Localidad, {
  foreignKey: 'localidad_id',
  as: 'localidad'
});

// Relaciones entre Persona y Usuario
Persona.hasOne(Usuario, {
  foreignKey: 'persona_id',
  as: 'usuario'
});

Usuario.belongsTo(Persona, {
  foreignKey: 'persona_id',
  as: 'persona'
});

// Relaciones entre Persona y Cliente
Persona.hasOne(Cliente, {
  foreignKey: 'persona_id',
  as: 'cliente'
});

Cliente.belongsTo(Persona, {
  foreignKey: 'persona_id',
  as: 'persona'
});

// Relaciones entre Marca y Modelo
Marca.hasMany(Modelo, {
  foreignKey: 'marca_id',
  as: 'modelos'
});

Modelo.belongsTo(Marca, {
  foreignKey: 'marca_id',
  as: 'marca'
});

// Relaciones entre Modelo y Version
Modelo.hasMany(Version, {
  foreignKey: 'modelo_id',
  as: 'versiones'
});

Version.belongsTo(Modelo, {
  foreignKey: 'modelo_id',
  as: 'modelo'
});

// Relaciones entre Cliente y Vehiculo
Cliente.hasMany(Vehiculo, {
  foreignKey: 'cliente_id',
  as: 'vehiculos'
});

Vehiculo.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// Relaciones entre Version y Vehiculo
Version.hasMany(Vehiculo, {
  foreignKey: 'version_id',
  as: 'vehiculos'
});

Vehiculo.belongsTo(Version, {
  foreignKey: 'version_id',
  as: 'version'
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
  Vehiculo
};
