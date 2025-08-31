import { Request, Response } from "express";
import { BaseService } from "../services/BaseService";
import {
  Cliente,
  Cobertura,
  ConfigAntiguedad,
  ConfigEdad,
  ConfigLocalidad,
  Cotizacion,
  LineaCotizacion,
  Localidad,
  Marca,
  Modelo,
  Persona,
  Poliza,
  Provincia,
  Vehiculo,
  Version,
} from "../models";
import { Model } from "sequelize";
import { version } from "os";

export class vehiculoCotizacionController {
  //HU9.1  --- El backend debe verificar que no haya una poliza o cotizacion con la matricula del vehiculo ingresado.
  static async verifyVehicle(req: Request, res: Response) {
    try {
      const { matricula } = req.params;
      // Traerse las polizas con ese vehiculo.
      const PolizasConVehiculos = await Poliza.findAll({
        include: [
          {
            model: LineaCotizacion,
            as: "lineaCotizacion",
            include: [
              {
                model: Cotizacion,
                as: "cotizacion",
                include: [
                  {
                    model: Vehiculo,
                    as: "vehiculo",
                  },
                ],
              },
            ],
          },
        ],
        where: {
          "$lineaCotizacion.cotizacion.vehiculo.matricula$": matricula,
        },
      });

      let activo = false;
      PolizasConVehiculos.forEach((poliza) => {
        if (
          poliza.estadoPoliza == "VIGENTE" ||
          poliza.estadoPoliza == "PENDIENTE" ||
          poliza.estadoPoliza == "EN_REVISIÓN" ||
          poliza.estadoPoliza == "APROBADA" ||
          poliza.estadoPoliza == "IMPAGA" ||
          poliza.estadoPoliza == "VENCIDA"
        ) {
          activo = true;
        }
      });

      return BaseService.success(
        res,
        activo,
        "Resultado de la verificacion del vehiculo"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los tipoContratacion"
      );
    }
  }
  // HU9.1 --- El backend debe ser capaz de guardar los datos del vehiculo
  static async createVehicle(req: Request, res: Response) {
    try {
      const {
        cliente_id,
        version_id,
        matricula,
        añoFabricacion,
        numeroMotor,
        chasis,
        gnc,
      } = req.body;

      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        return BaseService.notFound(res, "cliente no encontrado");
      }
      const version = await Cliente.findByPk(version_id);
      if (!version) {
        return BaseService.notFound(res, "version no encontrado");
      }
      if (!matricula) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La matricula del vehiculo es requerido",
              path: "matricula",
            },
          ],
        } as any);
      }
      if (!añoFabricacion) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La añoFabricacion del vehiculo es requerido",
              path: "añoFabricacion",
            },
          ],
        } as any);
      }
      if (!numeroMotor) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La numeroMotor del vehiculo es requerido",
              path: "numeroMotor",
            },
          ],
        } as any);
      }
      if (!chasis) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La chasis del vehiculo es requerido",
              path: "chasis",
            },
          ],
        } as any);
      }
      if (gnc === undefined || gnc === null) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "gnc de la vehiculo es requerido",
              path: "gnc",
            },
          ],
        } as any);
      }

      const vehiculoDb = await Vehiculo.findOne({
        where: { matricula: matricula },
      });

      if (!vehiculoDb) {
        const vehiculo = await Vehiculo.create({
          cliente_id,
          version_id,
          matricula,
          añoFabricacion,
          numeroMotor,
          chasis,
          gnc,
        });
        return BaseService.created(
          res,
          vehiculo,
          "vehiculo creada exitosamente"
        );
      } else {
        return BaseService.success(
          res,
          vehiculoDb,
          "vehiculo existente asignado"
        );
      }
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la Coberturas_Detalle"
      );
    }
  }

  //HU9.1 --- El backend debe ser capaz de guardar los datos de la cotizacion.
  static async createCotizacion(req: Request, res: Response) {
    try {
      const {
        fechaCreacion,
        fechaVencimiento,
        vehiculo_id,
        configuracionLocalidad_id,
        configuracionEdad_id,
        configuracionAntiguedad_id,
      } = req.body;

      if (!fechaCreacion) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La fechaCreacion de la cotizacion es requerida",
              path: "fechaCreacion",
            },
          ],
        } as any);
      }
      if (!fechaVencimiento) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La fechaVencimiento de la cotizacion es requerida",
              path: "fechaVencimiento",
            },
          ],
        } as any);
      }

      const nuevaCotizacion = await Cotizacion.create({
        fechaCreacion,
        fechaVencimiento,
        vehiculo_id,
        configuracionLocalidad_id,
        configuracionEdad_id,
        configuracionAntiguedad_id,
      });

      return BaseService.created(
        res,
        nuevaCotizacion,
        "Cotizacion creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la Cotizacion"
      );
    }
  }
  // HU9.1 --- El backend debe ser capaz de guardar los datos de la lineaCotizacion.
  static async createLineaCotizacion(req: Request, res: Response) {
    try {
      const { monto, cotizacion_id, cobertura_id } = req.body;

      if (!monto) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El monto de la linea cotizacion es requerida",
              path: "monto",
            },
          ],
        } as any);
      }

      const nuevaLineaCotizacion = await LineaCotizacion.create({
        monto,
        cotizacion_id,
        cobertura_id,
      });

      return BaseService.created(
        res,
        nuevaLineaCotizacion,
        "Linea_Cotizacion creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la Cotizacion"
      );
    }
  }
  // HU10 --- El backend debe ser capaz de devolver una lista de todas las cotizaciones del cliente.
  static async getCotizacionesByClientId(req: Request, res: Response) {
    try {
      const { idClient } = req.params;
      const cotizaciones = await Cotizacion.findAll({
        include: [
          {
            model: Vehiculo,
            as: "vehiculo",
            include: [
              {
                model: Cliente,
                as: "cliente",
                include: [
                  {
                    model: Persona,
                    as: "persona",
                  },
                ],
              },
              {
                model: Version,
                as: "version",
                include: [
                  {
                    model: Modelo,
                    as: "modelo",
                    include: [
                      {
                        model: Marca,
                        as: "marca",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        where: { "$vehiculo.cliente_id$": idClient },
      });

      if (!cotizaciones) {
        return BaseService.notFound(res, "cotizaciones no encontradas");
      }

      const finalCotizaciones = cotizaciones.map((cotizacion: any) => ({
        id: cotizacion.id,
        fechaCreacion: cotizacion.fechaCreacion,
        marca: cotizacion.vehiculo.version.modelo.marca.nombre,
        modelo: cotizacion.vehiculo.version.modelo.nombre,
        version: cotizacion.vehiculo.version.nombre,
        fechaVencimiento: cotizacion.fechaVencimiento,
      }));

      return BaseService.success(res, finalCotizaciones);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener la marca");
    }
  }

  // HU10 ---  El backend debe ser capaz de devolver una lista de lineaCotizacion de una cotización en especifico.
  static async getLineasCotizacionByCotizacionId(req: Request, res: Response) {
    try {
      const { cotizacion_id } = req.params;
      const lineasCotizacion = await LineaCotizacion.findAll({
        include: [
          {
            model: Cotizacion,
            as: "cotizacion",
            where: { id: cotizacion_id },
            include: [
              {
                model: Vehiculo,
                as: "vehiculo",
                include: [
                  {
                    model: Cliente,
                    as: "cliente",
                    include: [
                      {
                        model: Persona,
                        as: "persona",
                        include: [
                          {
                            model: Localidad,
                            as: "localidad",
                            include: [
                              {
                                model: Provincia,
                                as: "provincia",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: Version,
                    as: "version",
                    include: [
                      {
                        model: Modelo,
                        as: "modelo",
                        include: [
                          {
                            model: Marca,
                            as: "marca",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                model: ConfigAntiguedad,
                as: "configuracionantiguedad",
              },
              {
                model: ConfigEdad,
                as: "configuracionedad",
              },
              {
                model: ConfigLocalidad,
                as: "configuracionlocalidad",
                include: [
                  {
                    model: Localidad,
                    as: "localidad",
                    include: [
                      {
                        model: Provincia,
                        as: "provincia",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: Cobertura,
            as: "cobertura",
          },
        ],
      });

      if (!lineasCotizacion) {
        return BaseService.notFound(res, "cotizaciones no encontradas");
      }

      const finalLineasCotizacion = lineasCotizacion.map((LinCot: any) => ({
        id: LinCot.id,
        monto: LinCot.monto,
        cotizacion: {
          id: LinCot.cotizacion.id,
          fechaCreacion: LinCot.cotizacion.fechaCreacion,
          fechaVencimiento: LinCot.cotizacion.fechaVencimiento,
          vehiculo: {
            chasis: LinCot.cotizacion.vehiculo.chasis,
            matricula: LinCot.cotizacion.vehiculo.matricula,
            año_fabricacion: LinCot.cotizacion.vehiculo.año_fabricacion,
            numero_motor: LinCot.cotizacion.vehiculo.numero_motor,
            gnc: LinCot.cotizacion.vehiculo.gnc,
            version: {
              id: LinCot.cotizacion.vehiculo.version.id,
              nombre: LinCot.cotizacion.vehiculo.version.nombre,
              descripcion: LinCot.cotizacion.vehiculo.version.descripcion,
              precio_mercado: LinCot.cotizacion.vehiculo.version.precio_mercado,
              precio_mercado_gnc:
                LinCot.cotizacion.vehiculo.version.precio_mercado_gnc,
              modelo: {
                id: LinCot.cotizacion.vehiculo.version.modelo.id,
                nombre: LinCot.cotizacion.vehiculo.version.modelo.nombre,
                descripcion:
                  LinCot.cotizacion.vehiculo.version.modelo.descripcion,
                marca: {
                  id: LinCot.cotizacion.vehiculo.version.modelo.marca.id,
                  nombre:
                    LinCot.cotizacion.vehiculo.version.modelo.marca.nombre,
                  descripcion:
                    LinCot.cotizacion.vehiculo.version.modelo.marca.descripcion,
                },
              },
            },
            cliente: {
              idClient: LinCot.cotizacion.vehiculo.cliente.id,
              id: LinCot.cotizacion.vehiculo.cliente.persona.id,
              nombres: LinCot.cotizacion.vehiculo.cliente.persona.nombre,
              apellido: LinCot.cotizacion.vehiculo.cliente.persona.apellido,
              fechaNacimiento:
                LinCot.cotizacion.vehiculo.cliente.persona.fechaNacimiento,
              tipoDocumento:
                LinCot.cotizacion.vehiculo.cliente.persona.tipoDocumento,
              documento: LinCot.cotizacion.vehiculo.cliente.persona.documento,
              domicilio: LinCot.cotizacion.vehiculo.cliente.persona.domicilio,
              correo: LinCot.cotizacion.vehiculo.cliente.persona.correo,
              telefono: LinCot.cotizacion.vehiculo.cliente.persona.telefono,
              sexo: LinCot.cotizacion.vehiculo.cliente.persona.sexo,
              contraseña: LinCot.cotizacion.vehiculo.cliente.persona.contraseña,
              localidad: {
                id: LinCot.cotizacion.vehiculo.cliente.persona.localidad.id,
                descripcion:
                  LinCot.cotizacion.vehiculo.cliente.persona.localidad
                    .descripcion,
                codigoPostal:
                  LinCot.cotizacion.vehiculo.cliente.persona.localidad
                    .codigoPostal,
                provincia: {
                  id: LinCot.cotizacion.vehiculo.cliente.persona.localidad
                    .provincia.id,
                  descripcion:
                    LinCot.cotizacion.vehiculo.cliente.persona.localidad
                      .provincia.descripcion,
                },
              },
            },
          },
          configuracionLocalidad: {
            id: LinCot.cotizacion.configuracionlocalidad.id,
            nombre: LinCot.cotizacion.configuracionlocalidad.nombre,
            descuento: LinCot.cotizacion.configuracionlocalidad.descuento,
            ganancia: LinCot.cotizacion.configuracionlocalidad.ganancia,
            recargo: LinCot.cotizacion.configuracionlocalidad.recargo,
            activo: LinCot.cotizacion.configuracionlocalidad.activo,
            localidad: {
              id: LinCot.cotizacion.configuracionlocalidad.localidad.id,
              descripcion:
                LinCot.cotizacion.configuracionlocalidad.localidad.descripcion,
              codigoPostal:
                LinCot.cotizacion.configuracionlocalidad.localidad.codigoPostal,
              provincia: {
                id: LinCot.cotizacion.configuracionlocalidad.localidad.provincia
                  .id,
                descripcion:
                  LinCot.cotizacion.configuracionlocalidad.localidad.provincia
                    .descripcion,
              },
            },
            configuracionEdad: {
              id: LinCot.cotizacion.configuracionedad.id,
              nombre: LinCot.cotizacion.configuracionedad.nombre,
              minima: LinCot.cotizacion.configuracionedad.minima,
              maxima: LinCot.cotizacion.configuracionedad.maxima,
              descuento: LinCot.cotizacion.configuracionedad.descuento,
              ganancia: LinCot.cotizacion.configuracionedad.ganancia,
              recargo: LinCot.cotizacion.configuracionedad.recargo,
              activo: LinCot.cotizacion.configuracionedad.activo,
            },
            configuracionAntiguedad: {
              id: LinCot.cotizacion.configuracionantiguedad.id,
              nombre: LinCot.cotizacion.configuracionantiguedad.nombre,
              minima: LinCot.cotizacion.configuracionantiguedad.minima,
              maxima: LinCot.cotizacion.configuracionantiguedad.maxima,
              descuento: LinCot.cotizacion.configuracionantiguedad.descuento,
              ganancia: LinCot.cotizacion.configuracionantiguedad.ganancia,
              recargo: LinCot.cotizacion.configuracionantiguedad.recargo,
              activo: LinCot.cotizacion.configuracionantiguedad.activo,
            },
          },
          cobertura: {
            id_cobertura: LinCot.cobertura.id,
            nombre: LinCot.cobertura.nombre,
            descripcion: LinCot.cobertura.descripcion,
            recargoPorAtraso: LinCot.cobertura.recargoPorAtraso,
          },
        },
      }));

      return BaseService.success(res, finalLineasCotizacion);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener la linea");
    }
  }
}
