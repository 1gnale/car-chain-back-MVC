import dotenv from 'dotenv';
import sequelize from '../src/config/database';

// Importar modelos básicos
import Provincia from '../src/models/Provincia';
import Localidad from '../src/models/Localidad';
import Marca from '../src/models/Marca';
import Modelo from '../src/models/Modelo';
import Version from '../src/models/Version';
import Persona from '../src/models/Persona';
import Cliente from '../src/models/Cliente';
import Usuario from '../src/models/Usuario';
import Vehiculo from '../src/models/Vehiculo';
import Cobertura from '../src/models/Cobertura';
import Detalle from '../src/models/Detalle';
import CoberturaDetalle from '../src/models/CoberturaDetalle';
import PeriodoPago from '../src/models/PeriodoPago';
import TipoContratacion from '../src/models/TipoContratacion';
import Pago from '../src/models/Pago';
import Documentacion from '../src/models/Documentacion';
import Cotizacion from '../src/models/Cotizacion';
import LineaCotizacion from '../src/models/LineaCotizacion';
import Poliza from '../src/models/Poliza';

dotenv.config();

class SimpleDataSeeder {
  
  private async clearTables() {
    console.log('🗑️  Limpiando base de datos...');
    
    const queries = [
      'SET FOREIGN_KEY_CHECKS = 0',
      'DELETE FROM pago',
      'DELETE FROM poliza', 
      'DELETE FROM lineacotizacion',
      'DELETE FROM cotizacion',
      'DELETE FROM documentacion',
      'DELETE FROM tipocontratacion',
      'DELETE FROM periodopago',
      'DELETE FROM coberturadetalle',
      'DELETE FROM detalle',
      'DELETE FROM cobertura',
      'DELETE FROM vehiculo',
      'DELETE FROM version',
      'DELETE FROM modelo',
      'DELETE FROM marca',
      'DELETE FROM cliente',
      'DELETE FROM usuario',
      'DELETE FROM persona',
      'DELETE FROM configuracionlocalidad',
      'DELETE FROM configuracionedad',
      'DELETE FROM configuracionantiguedad',
      'DELETE FROM localidad',
      'DELETE FROM provincia',
      'SET FOREIGN_KEY_CHECKS = 1'
    ];

    for (const query of queries) {
      try {
        await sequelize.query(query);
      } catch (error) {
        console.log(`⚠️  Error ejecutando: ${query}`);
      }
    }
    console.log('✅ Base de datos limpiada');
  }

  private async seedProvincias() {
    console.log('📍 Creando provincias...');
    
    const provincias = [
      { descripcion: 'Buenos Aires', activo: true },
      { descripcion: 'Córdoba', activo: true },
      { descripcion: 'Santa Fe', activo: true },
      { descripcion: 'Mendoza', activo: true },
      { descripcion: 'Ciudad Autónoma de Buenos Aires', activo: true }
    ];

    const created = await Provincia.bulkCreate(provincias);
    console.log(`✅ ${created.length} provincias creadas`);
    return created;
  }

  private async seedLocalidades() {
    console.log('🏘️  Creating localidades...');
    
    // Primero obtenemos las provincias que acabamos de crear
    const provincias = await Provincia.findAll();
    console.log(`Found ${provincias.length} provincias for reference`);

    const localidades = [
      { descripcion: 'La Plata', codigoPostal: '1900', provincia_id: provincias[0].id, activo: true },
      { descripcion: 'Mar del Plata', codigoPostal: '7600', provincia_id: provincias[0].id, activo: true },
      { descripcion: 'Córdoba Capital', codigoPostal: '5000', provincia_id: provincias[1].id, activo: true },
      { descripcion: 'Rosario', codigoPostal: '2000', provincia_id: provincias[2].id, activo: true },
      { descripcion: 'Palermo', codigoPostal: '1425', provincia_id: provincias[4].id, activo: true }
    ];

    const created = await Localidad.bulkCreate(localidades);
    console.log(`✅ ${created.length} localidades creadas`);
    return created;
  }

  private async seedMarcas() {
    console.log('🚗 Creando marcas...');
    
    const marcas = [
      { nombre: 'Toyota', descripcion: 'Toyota Motor Corporation', activo: true },
      { nombre: 'Ford', descripcion: 'Ford Motor Company', activo: true },
      { nombre: 'Chevrolet', descripcion: 'General Motors', activo: true },
      { nombre: 'Volkswagen', descripcion: 'Volkswagen AG', activo: true },
      { nombre: 'Fiat', descripcion: 'Fiat Chrysler Automobiles', activo: true }
    ];

    const created = await Marca.bulkCreate(marcas);
    console.log(`✅ ${created.length} marcas creadas`);
    return created;
  }

  private async seedModelos() {
    console.log('🚙 Creando modelos...');
    
    // Obtener las marcas que acabamos de crear
    const marcas = await Marca.findAll();
    console.log(`Found ${marcas.length} marcas for reference`);
    
    const modelos = [
      { nombre: 'Corolla', descripcion: 'Sedán compacto', marca_id: marcas[0].id, activo: true },
      { nombre: 'Hilux', descripcion: 'Pick-up mediana', marca_id: marcas[0].id, activo: true },
      { nombre: 'Ka', descripcion: 'Hatchback urbano', marca_id: marcas[1].id, activo: true },
      { nombre: 'Focus', descripcion: 'Hatchback compacto', marca_id: marcas[1].id, activo: true },
      { nombre: 'Onix', descripcion: 'Hatchback compacto', marca_id: marcas[2].id, activo: true },
      { nombre: 'Gol', descripcion: 'Hatchback económico', marca_id: marcas[3].id, activo: true },
      { nombre: 'Uno', descripcion: 'Hatchback económico', marca_id: marcas[4].id, activo: true }
    ];

    const created = await Modelo.bulkCreate(modelos);
    console.log(`✅ ${created.length} modelos creados`);
    return created;
  }

  private async seedVersiones() {
    console.log('🔧 Creando versiones...');
    
    // Obtener los modelos que acabamos de crear
    const modelos = await Modelo.findAll();
    console.log(`Found ${modelos.length} modelos for reference`);
    
    const versiones = [
      { nombre: 'XLI', descripcion: 'XLI 1.8 MT', precio_mercado: 3500000, precio_mercado_gnc: 3700000, modelo_id: modelos[0].id, activo: true },
      { nombre: 'XEI', descripcion: 'XEI 1.8 CVT', precio_mercado: 4200000, precio_mercado_gnc: 4400000, modelo_id: modelos[0].id, activo: true },
      { nombre: 'DX', descripcion: 'DX 2.4 4x2 CD', precio_mercado: 5500000, precio_mercado_gnc: 5800000, modelo_id: modelos[1].id, activo: true },
      { nombre: 'S', descripcion: 'S 1.5', precio_mercado: 2800000, precio_mercado_gnc: 3000000, modelo_id: modelos[2].id, activo: true },
      { nombre: 'SE', descripcion: 'SE 1.5', precio_mercado: 3200000, precio_mercado_gnc: 3400000, modelo_id: modelos[3].id, activo: true },
      { nombre: 'Joy', descripcion: 'Joy 1.4', precio_mercado: 2600000, precio_mercado_gnc: 2800000, modelo_id: modelos[4].id, activo: true },
      { nombre: 'Trend', descripcion: 'Trendline 1.6', precio_mercado: 2400000, precio_mercado_gnc: 2600000, modelo_id: modelos[5].id, activo: true },
      { nombre: 'Way', descripcion: 'Way 1.4', precio_mercado: 2200000, precio_mercado_gnc: 2400000, modelo_id: modelos[6].id, activo: true }
    ];

    const created = await Version.bulkCreate(versiones);
    console.log(`✅ ${created.length} versiones creadas`);
    return created;
  }

  private async seedPersonas() {
    console.log('👥 Creando personas...');
    
    // Obtener las localidades que acabamos de crear
    const localidades = await Localidad.findAll();
    console.log(`Found ${localidades.length} localidades for reference`);
    
    const personas = [
      {
        nombres: 'Juan Carlos',
        apellido: 'García López',
        fechaNacimiento: new Date('1985-03-15'),
        tipoDocumento: 'DNI' as any,
        documento: '20123456789',
        telefono: '11-4555-1234',
        correo: 'juan.garcia@email.com',
        domicilio: 'Av. Corrientes 1234',
        sexo: 'Masculino',
        contraseña: 'password123',
        localidad_id: localidades[0].id
      },
      {
        nombres: 'María Elena',
        apellido: 'Rodríguez Martín',
        fechaNacimiento: new Date('1990-07-22'),
        tipoDocumento: 'DNI' as any,
        documento: '27234567890',
        telefono: '11-4555-5678',
        correo: 'maria.rodriguez@email.com',
        domicilio: 'Calle 50 N° 567',
        sexo: 'Femenino',
        contraseña: 'password123',
        localidad_id: localidades[0].id
      },
      {
        nombres: 'Carlos Alberto',
        apellido: 'López Fernández',
        fechaNacimiento: new Date('1982-11-08'),
        tipoDocumento: 'DNI' as any,
        documento: '23345678901',
        telefono: '341-4555-9012',
        correo: 'carlos.lopez@email.com',
        domicilio: 'San Martín 890',
        sexo: 'Masculino',
        contraseña: 'password123',
        localidad_id: localidades[3].id
      },
      {
        nombres: 'Ana Sofía',
        apellido: 'Martínez Gómez',
        fechaNacimiento: new Date('1995-01-30'),
        tipoDocumento: 'DNI' as any,
        documento: '30456789012',
        telefono: '351-4555-3456',
        correo: 'ana.martinez@email.com',
        domicilio: 'Rivadavia 456',
        sexo: 'Femenino',
        contraseña: 'password123',
        localidad_id: localidades[2].id
      },
      {
        nombres: 'Roberto Daniel',
        apellido: 'Fernández Silva',
        fechaNacimiento: new Date('1988-09-12'),
        tipoDocumento: 'DNI' as any,
        documento: '25567890123',
        telefono: '223-4555-7890',
        correo: 'roberto.fernandez@email.com',
        domicilio: 'Belgrano 789',
        sexo: 'Masculino',
        contraseña: 'password123',
        localidad_id: localidades[1].id
      }
    ];

    const created = await Persona.bulkCreate(personas);
    console.log(`✅ ${created.length} personas creadas`);
    return created;
  }

  private async seedUsuarios() {
    console.log('👤 Creando usuarios...');
    
    // Obtener las personas que acabamos de crear
    const personas = await Persona.findAll();
    console.log(`Found ${personas.length} personas for reference`);
    
    const usuarios = [
      {
        tipoUsuario: 'ADMINISTRADOR' as any,
        persona_id: personas[0].id,
        activo: true
      },
      {
        tipoUsuario: 'VENDEDOR' as any,
        persona_id: personas[1].id,
        activo: true
      },
      {
        tipoUsuario: 'VENDEDOR' as any,
        persona_id: personas[2].id,
        activo: true
      }
    ];

    const created = await Usuario.bulkCreate(usuarios);
    console.log(`✅ ${created.length} usuarios creados`);
    return created;
  }

  private async seedClientes() {
    console.log('👨‍💼 Creando clientes...');
    
    // Obtener las personas que acabamos de crear (usar las últimas 4 personas como clientes)
    const personas = await Persona.findAll();
    console.log(`Found ${personas.length} personas for reference`);
    
    const clientes = [
      {
        persona_id: personas[0].id
      },
      {
        persona_id: personas[1].id
      },
      {
        persona_id: personas[3].id
      },
      {
        persona_id: personas[4].id
      }
    ];

    const created = await Cliente.bulkCreate(clientes);
    console.log(`✅ ${created.length} clientes creados`);
    return created;
  }

  private async seedVehiculos() {
    console.log('🚗 Creando vehículos...');
    
    // Obtener las referencias que necesitamos
    const clientes = await Cliente.findAll();
    const versiones = await Version.findAll();
    console.log(`Found ${clientes.length} clientes and ${versiones.length} versiones for reference`);
    
    const vehiculos = [
      {
        matricula: 'ABC123',
        chasis: '9BWZZZ377VT004251',
        numeroMotor: '2TR001234',
        añoFabricacion: 2020,
        gnc: false,
        cliente_id: clientes[0].idClient,
        version_id: versiones[0].id
      },
      {
        matricula: 'DEF456',
        chasis: '9BWZZZ377VT004252',
        numeroMotor: '2TR001235',
        añoFabricacion: 2021,
        gnc: false,
        cliente_id: clientes[1].idClient,
        version_id: versiones[2].id
      },
      {
        matricula: 'GHI789',
        chasis: '9BWZZZ377VT004253',
        numeroMotor: '1KR001236',
        añoFabricacion: 2019,
        gnc: true,
        cliente_id: clientes[2].idClient,
        version_id: versiones[3].id
      },
      {
        matricula: 'JKL012',
        chasis: '9BWZZZ377VT004254',
        numeroMotor: '1KR001237',
        añoFabricacion: 2022,
        gnc: false,
        cliente_id: clientes[3].idClient,
        version_id: versiones[5].id
      }
    ];

    const created = await Vehiculo.bulkCreate(vehiculos);
    console.log(`✅ ${created.length} vehículos creados`);
    return created;
  }

  private async seedCoberturas() {
    console.log('🛡️  Creando coberturas...');
    
    const coberturas = [
      {
        nombre: 'Responsabilidad Civil',
        descripcion: 'Cobertura por daños a terceros',
        recargoPorAtraso: 0.05,
        activo: true
      },
      {
        nombre: 'Todo Riesgo',
        descripcion: 'Cobertura completa del vehículo',
        recargoPorAtraso: 0.08,
        activo: true
      },
      {
        nombre: 'Robo e Incendio',
        descripcion: 'Cobertura contra robo e incendio',
        recargoPorAtraso: 0.06,
        activo: true
      },
      {
        nombre: 'Granizo',
        descripcion: 'Cobertura contra granizo',
        recargoPorAtraso: 0.03,
        activo: true
      }
    ];

    const created = await Cobertura.bulkCreate(coberturas);
    console.log(`✅ ${created.length} coberturas creadas`);
    return created;
  }

  private async seedDetalles() {
    console.log('📋 Creando detalles...');
    
    const detalles = [
      {
        nombre: 'Paquete Básico',
        descripcion: 'Paquete de cobertura básica',
        porcentaje_miles: 0.5,
        monto_fijo: 5000.00,
        activo: true
      },
      {
        nombre: 'Paquete Completo',
        descripcion: 'Paquete de cobertura completa',
        porcentaje_miles: 0.8,
        monto_fijo: 8500.00,
        activo: true
      },
      {
        nombre: 'Paquete Premium',
        descripcion: 'Paquete de cobertura premium',
        porcentaje_miles: 1.2,
        monto_fijo: 12000.00,
        activo: true
      },
      {
        nombre: 'Granizo Adicional',
        descripcion: 'Cobertura adicional contra granizo',
        porcentaje_miles: 0.25,
        monto_fijo: 2500.00,
        activo: true
      }
    ];

    const created = await Detalle.bulkCreate(detalles);
    console.log(`✅ ${created.length} detalles creados`);
    return created;
  }

  private async seedCoberturaDetalles() {
    console.log('🔗 Creando relaciones cobertura-detalle...');
    
    // Obtener las coberturas y detalles que acabamos de crear
    const coberturas = await Cobertura.findAll();
    const detalles = await Detalle.findAll();
    console.log(`Found ${coberturas.length} coberturas and ${detalles.length} detalles for reference`);
    
    const relaciones = [
      { cobertura_id: coberturas[0].id_cobertura, detalle_id: detalles[0].id, aplica: true },
      { cobertura_id: coberturas[1].id_cobertura, detalle_id: detalles[1].id, aplica: true },
      { cobertura_id: coberturas[1].id_cobertura, detalle_id: detalles[2].id, aplica: true },
      { cobertura_id: coberturas[2].id_cobertura, detalle_id: detalles[1].id, aplica: true },
      { cobertura_id: coberturas[3].id_cobertura, detalle_id: detalles[3].id, aplica: true }
    ];

    const created = await CoberturaDetalle.bulkCreate(relaciones);
    console.log(`✅ ${created.length} relaciones cobertura-detalle creadas`);
    return created;
  }

  private async seedTiposContratacion() {
    console.log('📝 Creando tipos de contratación...');
    
    const tipos = [
      { nombre: 'Anual', cantidadMeses: 12, activo: true },
      { nombre: 'Semestral', cantidadMeses: 6, activo: true },
      { nombre: 'Trimestral', cantidadMeses: 3, activo: true },
      { nombre: 'Mensual', cantidadMeses: 1, activo: true }
    ];

    const created = await TipoContratacion.bulkCreate(tipos);
    console.log(`✅ ${created.length} tipos de contratación creados`);
    return created;
  }

  private async seedPeriodosPago() {
    console.log('💳 Creando períodos de pago...');
    
    const periodos = [
      { nombre: 'Contado', cantidadMeses: 1, descuento: 0.05, activo: true },
      { nombre: '3 Cuotas', cantidadMeses: 3, descuento: 0.0, activo: true },
      { nombre: '6 Cuotas', cantidadMeses: 6, descuento: 0.0, activo: true },
      { nombre: '12 Cuotas', cantidadMeses: 12, descuento: 0.0, activo: true }
    ];

    const created = await PeriodoPago.bulkCreate(periodos);
    console.log(`✅ ${created.length} períodos de pago creados`);
    return created;
  }

  private async seedDocumentacion() {
    console.log('📄 Creando documentación...');
    
    // Crear documentación ficticia con buffers vacíos
    const documentos = [
      {
        fotoFrontal: Buffer.from('fake-photo-frontal-1'),
        fotoTrasera: Buffer.from('fake-photo-trasera-1'),
        fotoLateral1: Buffer.from('fake-photo-lateral1-1'),
        fotoLateral2: Buffer.from('fake-photo-lateral2-1'),
        fotoTecho: Buffer.from('fake-photo-techo-1'),
        cedulaVerde: Buffer.from('fake-cedula-verde-1')
      },
      {
        fotoFrontal: Buffer.from('fake-photo-frontal-2'),
        fotoTrasera: Buffer.from('fake-photo-trasera-2'),
        fotoLateral1: Buffer.from('fake-photo-lateral1-2'),
        fotoLateral2: Buffer.from('fake-photo-lateral2-2'),
        fotoTecho: Buffer.from('fake-photo-techo-2'),
        cedulaVerde: Buffer.from('fake-cedula-verde-2')
      },
      {
        fotoFrontal: Buffer.from('fake-photo-frontal-3'),
        fotoTrasera: Buffer.from('fake-photo-trasera-3'),
        fotoLateral1: Buffer.from('fake-photo-lateral1-3'),
        fotoLateral2: Buffer.from('fake-photo-lateral2-3'),
        fotoTecho: Buffer.from('fake-photo-techo-3'),
        cedulaVerde: Buffer.from('fake-cedula-verde-3')
      },
      {
        fotoFrontal: Buffer.from('fake-photo-frontal-4'),
        fotoTrasera: Buffer.from('fake-photo-trasera-4'),
        fotoLateral1: Buffer.from('fake-photo-lateral1-4'),
        fotoLateral2: Buffer.from('fake-photo-lateral2-4'),
        fotoTecho: Buffer.from('fake-photo-techo-4'),
        cedulaVerde: Buffer.from('fake-cedula-verde-4')
      },
      {
        fotoFrontal: Buffer.from('fake-photo-frontal-5'),
        fotoTrasera: Buffer.from('fake-photo-trasera-5'),
        fotoLateral1: Buffer.from('fake-photo-lateral1-5'),
        fotoLateral2: Buffer.from('fake-photo-lateral2-5'),
        fotoTecho: Buffer.from('fake-photo-techo-5'),
        cedulaVerde: Buffer.from('fake-cedula-verde-5')
      }
    ];

    const created = await Documentacion.bulkCreate(documentos);
    console.log(`✅ ${created.length} documentos creados`);
    return created;
  }

  private async seedCotizaciones() {
    console.log('💰 Creando cotizaciones...');
    
    // Obtener vehículos para las cotizaciones
    const vehiculos = await Vehiculo.findAll();
    console.log(`Found ${vehiculos.length} vehiculos for reference`);
    
    const cotizaciones = [
      {
        fechaCreacion: new Date('2024-01-15'),
        fechaVencimiento: new Date('2024-02-15'),
        vehiculo_id: vehiculos[0].id,
        configuracionLocalidad_id: undefined,
        configuracionEdad_id: undefined,
        configuracionAntiguedad_id: undefined
      },
      {
        fechaCreacion: new Date('2024-01-20'),
        fechaVencimiento: new Date('2024-02-20'),
        vehiculo_id: vehiculos[1].id,
        configuracionLocalidad_id: undefined,
        configuracionEdad_id: undefined,
        configuracionAntiguedad_id: undefined
      },
      {
        fechaCreacion: new Date('2024-01-25'),
        fechaVencimiento: new Date('2024-02-25'),
        vehiculo_id: vehiculos[2].id,
        configuracionLocalidad_id: undefined,
        configuracionEdad_id: undefined,
        configuracionAntiguedad_id: undefined
      },
      {
        fechaCreacion: new Date('2024-02-01'),
        fechaVencimiento: new Date('2024-03-01'),
        vehiculo_id: vehiculos[3].id,
        configuracionLocalidad_id: undefined,
        configuracionEdad_id: undefined,
        configuracionAntiguedad_id: undefined
      },
      {
        fechaCreacion: new Date('2024-02-05'),
        fechaVencimiento: new Date('2024-03-05'),
        vehiculo_id: vehiculos[0].id, // Segunda cotización para el primer vehículo
        configuracionLocalidad_id: undefined,
        configuracionEdad_id: undefined,
        configuracionAntiguedad_id: undefined
      }
    ];

    const created = await Cotizacion.bulkCreate(cotizaciones);
    console.log(`✅ ${created.length} cotizaciones creadas`);
    return created;
  }

  private async seedLineaCotizaciones() {
    console.log('📋 Creando líneas de cotización...');
    
    // Obtener cotizaciones y coberturas
    const cotizaciones = await Cotizacion.findAll();
    const coberturas = await Cobertura.findAll();
    console.log(`Found ${cotizaciones.length} cotizaciones and ${coberturas.length} coberturas for reference`);
    
    const lineas = [
      {
        monto: 15000.00,
        cotizacion_id: cotizaciones[0].id,
        cobertura_id: coberturas[0].id_cobertura
      },
      {
        monto: 25000.00,
        cotizacion_id: cotizaciones[1].id,
        cobertura_id: coberturas[1].id_cobertura
      },
      {
        monto: 20000.00,
        cotizacion_id: cotizaciones[2].id,
        cobertura_id: coberturas[2].id_cobertura
      },
      {
        monto: 18000.00,
        cotizacion_id: cotizaciones[3].id,
        cobertura_id: coberturas[1].id_cobertura
      },
      {
        monto: 22000.00,
        cotizacion_id: cotizaciones[4].id,
        cobertura_id: coberturas[3].id_cobertura
      }
    ];

    const created = await LineaCotizacion.bulkCreate(lineas);
    console.log(`✅ ${created.length} líneas de cotización creadas`);
    return created;
  }

  private async seedPolizas() {
    console.log('📜 Creando pólizas...');
    
    // Obtener las referencias necesarias
    const usuarios = await Usuario.findAll();
    const documentos = await Documentacion.findAll();
    const lineasCotizacion = await LineaCotizacion.findAll();
    const periodosPago = await PeriodoPago.findAll();
    const tiposContratacion = await TipoContratacion.findAll();
    
    console.log(`Found ${usuarios.length} usuarios, ${documentos.length} documentos, ${lineasCotizacion.length} líneas cotización`);
    
    const polizas = [
      {
        usuario_legajo: usuarios[0].legajo,
        documentacion_id: documentos[0].id,
        lineaCotizacion_id: lineasCotizacion[0].id,
        periodoPago_id: periodosPago[0].id,
        tipoContratacion_id: tiposContratacion[0].id,
        precioPolizaActual: 15000.00,
        montoAsegurado: 3500000.00,
        fechaContratacion: new Date('2024-02-01'),
        horaContratacion: '10:30:00',
        fechaVencimiento: new Date('2025-02-01'),
        renovacionAutomatica: true,
        estadoPoliza: 'VIGENTE' as any
      },
      {
        usuario_legajo: usuarios[1].legajo,
        documentacion_id: documentos[1].id,
        lineaCotizacion_id: lineasCotizacion[1].id,
        periodoPago_id: periodosPago[1].id,
        tipoContratacion_id: tiposContratacion[0].id,
        precioPolizaActual: 25000.00,
        montoAsegurado: 5500000.00,
        fechaContratacion: new Date('2024-02-05'),
        horaContratacion: '14:15:00',
        fechaVencimiento: new Date('2025-02-05'),
        renovacionAutomatica: true,
        estadoPoliza: 'VIGENTE' as any
      },
      {
        usuario_legajo: usuarios[2].legajo,
        documentacion_id: documentos[2].id,
        lineaCotizacion_id: lineasCotizacion[2].id,
        periodoPago_id: periodosPago[2].id,
        tipoContratacion_id: tiposContratacion[1].id,
        precioPolizaActual: 20000.00,
        montoAsegurado: 2800000.00,
        fechaContratacion: new Date('2024-02-10'),
        horaContratacion: '16:45:00',
        fechaVencimiento: new Date('2024-08-10'),
        renovacionAutomatica: false,
        estadoPoliza: 'VIGENTE' as any
      },
      {
        usuario_legajo: usuarios[0].legajo,
        documentacion_id: documentos[3].id,
        lineaCotizacion_id: lineasCotizacion[3].id,
        periodoPago_id: periodosPago[3].id,
        tipoContratacion_id: tiposContratacion[3].id,
        precioPolizaActual: 18000.00,
        montoAsegurado: 3200000.00,
        fechaContratacion: new Date('2024-02-15'),
        horaContratacion: '11:20:00',
        fechaVencimiento: new Date('2024-03-15'),
        renovacionAutomatica: true,
        estadoPoliza: 'VIGENTE' as any
      },
      {
        usuario_legajo: usuarios[1].legajo,
        documentacion_id: documentos[4].id,
        lineaCotizacion_id: lineasCotizacion[4].id,
        periodoPago_id: periodosPago[0].id,
        tipoContratacion_id: tiposContratacion[0].id,
        precioPolizaActual: 22000.00,
        montoAsegurado: 3500000.00,
        fechaContratacion: new Date('2024-02-20'),
        horaContratacion: '09:00:00',
        fechaVencimiento: new Date('2025-02-20'),
        renovacionAutomatica: true,
        estadoPoliza: 'VIGENTE' as any
      }
    ];

    const created = await Poliza.bulkCreate(polizas);
    console.log(`✅ ${created.length} pólizas creadas`);
    return created;
  }

  private async seedPagos() {
    console.log('💵 Creando pagos de prueba...');
    
    // Obtener las pólizas que acabamos de crear
    const polizas = await Poliza.findAll();
    console.log(`Found ${polizas.length} polizas for reference`);
    
    const pagos = [
      {
        total: 15000.00,
        fecha: new Date('2024-02-01'),
        hora: '14:30:00',
        poliza_numero: polizas[0].numero_poliza,
        mp_payment_id: 'MP001234567',
        mp_status: 'approved',
        mp_status_detail: 'accredited',
        mp_external_reference: `poliza_${polizas[0].numero_poliza}_20240201`,
        mp_payment_method_id: 'visa',
        mp_payment_type_id: 'credit_card',
        mp_preference_id: 'PREF001234567'
      },
      {
        total: 8333.33,
        fecha: new Date('2024-02-05'),
        hora: '10:15:00',
        poliza_numero: polizas[1].numero_poliza,
        mp_payment_id: 'MP001234568',
        mp_status: 'approved',
        mp_status_detail: 'accredited',
        mp_external_reference: `poliza_${polizas[1].numero_poliza}_20240205`,
        mp_payment_method_id: 'mastercard',
        mp_payment_type_id: 'credit_card',
        mp_preference_id: 'PREF001234568'
      },
      {
        total: 3333.33,
        fecha: new Date('2024-02-10'),
        hora: '16:45:00',
        poliza_numero: polizas[2].numero_poliza,
        mp_payment_id: 'MP001234569',
        mp_status: 'approved',
        mp_status_detail: 'accredited',
        mp_external_reference: `poliza_${polizas[2].numero_poliza}_20240210`,
        mp_payment_method_id: 'visa',
        mp_payment_type_id: 'debit_card',
        mp_preference_id: 'PREF001234569'
      },
      {
        total: 1500.00,
        fecha: new Date('2024-02-15'),
        hora: '12:20:00',
        poliza_numero: polizas[3].numero_poliza,
        mp_payment_id: 'MP001234570',
        mp_status: 'approved',
        mp_status_detail: 'accredited',
        mp_external_reference: `poliza_${polizas[3].numero_poliza}_20240215`,
        mp_payment_method_id: 'account_money',
        mp_payment_type_id: 'account_money',
        mp_preference_id: 'PREF001234570'
      },
      {
        total: 22000.00,
        fecha: new Date('2024-02-20'),
        hora: '09:30:00',
        poliza_numero: polizas[4].numero_poliza,
        mp_status: 'pending',
        mp_external_reference: `poliza_${polizas[4].numero_poliza}_20240220`,
        mp_preference_id: 'PREF001234571'
      }
    ];

    const created = await Pago.bulkCreate(pagos);
    console.log(`✅ ${created.length} pagos creados`);
    return created;
  }

  public async seedAll() {
    try {
      console.log('🌱 Iniciando proceso de seeders (versión simplificada)...');
      console.log('========================================================');

      // Conectar a la base de datos
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida');

      // Limpiar base de datos
      await this.clearTables();

      // Seed en orden de dependencias
      const provincias = await this.seedProvincias();
      const localidades = await this.seedLocalidades();
      const marcas = await this.seedMarcas();
      const modelos = await this.seedModelos();
      const versiones = await this.seedVersiones();
      const personas = await this.seedPersonas();
      const usuarios = await this.seedUsuarios();
      const clientes = await this.seedClientes();
      const vehiculos = await this.seedVehiculos();
      const coberturas = await this.seedCoberturas();
      const detalles = await this.seedDetalles();
      const coberturaDetalles = await this.seedCoberturaDetalles();
      const tiposContratacion = await this.seedTiposContratacion();
      const periodosPago = await this.seedPeriodosPago();
      
      // Crear dependencias para pólizas
      const documentacion = await this.seedDocumentacion();
      const cotizaciones = await this.seedCotizaciones();
      const lineasCotizacion = await this.seedLineaCotizaciones();
      const polizas = await this.seedPolizas();
      const pagos = await this.seedPagos();

      console.log('========================================================');
      console.log('🎉 ¡Seeders completados exitosamente!');
      console.log('========================================================');

      console.log('\n📊 RESUMEN DE DATOS CREADOS:');
      console.log(`📍 Provincias: ${provincias.length}`);
      console.log(`🏘️  Localidades: ${localidades.length}`);
      console.log(`🚗 Marcas: ${marcas.length}`);
      console.log(`🚙 Modelos: ${modelos.length}`);
      console.log(`🔧 Versiones: ${versiones.length}`);
      console.log(`👥 Personas: ${personas.length}`);
      console.log(`👤 Usuarios: ${usuarios.length}`);
      console.log(`👨‍💼 Clientes: ${clientes.length}`);
      console.log(`🚗 Vehículos: ${vehiculos.length}`);
      console.log(`🛡️  Coberturas: ${coberturas.length}`);
      console.log(`📋 Detalles: ${detalles.length}`);
      console.log(`🔗 Relaciones Cob-Det: ${coberturaDetalles.length}`);
      console.log(`📝 Tipos Contratación: ${tiposContratacion.length}`);
      console.log(`💳 Períodos Pago: ${periodosPago.length}`);
      console.log(`📄 Documentación: ${documentacion.length}`);
      console.log(`💰 Cotizaciones: ${cotizaciones.length}`);
      console.log(`📋 Líneas Cotización: ${lineasCotizacion.length}`);
      console.log(`📜 Pólizas: ${polizas.length}`);
      console.log(`💵 Pagos: ${pagos.length}`);
      
      console.log('\n🎯 DATOS LISTOS PARA PROBAR:');
      console.log('- Usuarios: LEG001, LEG002, LEG003');
      console.log('- Clientes con vehículos asignados');
      console.log('- Coberturas y detalles relacionados');
      console.log('- 5 Pólizas vigentes con documentación');
      console.log('- Cotizaciones y líneas de cotización');
      console.log('- Configuraciones básicas del sistema');
      console.log('\n✅ LISTO: Ahora puedes crear pagos usando las pólizas generadas');
      
    } catch (error) {
      console.error('❌ Error durante el seeding:', error);
      throw error;
    } finally {
      await sequelize.close();
    }
  }
}

// Ejecutar seeders si el archivo se ejecuta directamente
if (require.main === module) {
  const seeder = new SimpleDataSeeder();
  seeder.seedAll()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export default SimpleDataSeeder;
