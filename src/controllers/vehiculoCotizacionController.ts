import { Request, Response } from "express";
import { BaseService } from "../services/BaseService";
import cron from "node-cron";
import { Op } from "sequelize";
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

import { Sequelize } from "sequelize";
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
        mail,
        version_id,
        matricula,
        añoFabricacion,
        numeroMotor,
        chasis,
        gnc,
      } = req.body;

      const cliente = await Cliente.findOne({
        include: [{ model: Persona, as: "persona", where: { correo: mail } }],
      });
      if (!cliente) {
        return BaseService.notFound(res, "cliente no encontrado");
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
          cliente_id: cliente.idClient,
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

      // Debug: verificar qué datos están llegando
      console.log("Datos recibidos para cotización:", {
        fechaCreacion,
        fechaVencimiento,
        vehiculo_id,
        configuracionLocalidad_id,
        configuracionEdad_id,
        configuracionAntiguedad_id,
      });

      const nuevaCotizacion = await Cotizacion.create({
        fechaCreacion,
        fechaVencimiento,
        vehiculo_id,
        configuracionLocalidad_id,
        configuracionEdad_id,
        configuracionAntiguedad_id,
        activo: true,
      });

      console.log("Cotización creada:", nuevaCotizacion.toJSON());

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
      const { mail } = req.params;
      const cliente = await Cliente.findOne({
        include: [{ model: Persona, as: "persona", where: { correo: mail } }],
      });
      if (!cliente) {
        return BaseService.notFound(res, "cliente no encontrado");
      }
      const idClient = cliente.idClient;
      const cotizaciones = await Cotizacion.findAll({
        include: [
          {
            model: Vehiculo,
            as: "vehiculo",
            where: { cliente_id: idClient }, // filtro cliente
            attributes: [],
          },
        ],
        where: {
          id: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT lc.cotizacion_id
          FROM lineacotizacion lc
          INNER JOIN poliza p ON p.lineacotizacion_id = lc.idlineacotizacion
          WHERE lc.cotizacion_id IS NOT NULL)`
            ),
          },
        },
        order: [["fechacreacioncotizacion", "DESC"]],
      });

      const finalCotizaciones = cotizaciones.map((cotizacion: any) => ({
        id: cotizacion.id,
        fechaCreacion: cotizacion.fechaCreacion,
        fechaVencimiento: cotizacion.fechaVencimiento,
        activo: cotizacion.activo,
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
        where: { cotizacion_id: cotizacion_id },
        include: [
          {
            model: Cotizacion,
            as: "cotizacion",
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
      console.log("lineasCotizacion");
      console.log(lineasCotizacion);

      if (lineasCotizacion.length === 0) {
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
            id: LinCot.cotizacion.vehiculo.id,
            chasis: LinCot.cotizacion.vehiculo.chasis,
            matricula: LinCot.cotizacion.vehiculo.matricula,
            añoFabricacion: LinCot.cotizacion.vehiculo.año_fabricacion,
            numeroMotor: LinCot.cotizacion.vehiculo.numeroMotor,
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
              idClient: LinCot.cotizacion.vehiculo.cliente.idClient,
              id: LinCot.cotizacion.vehiculo.cliente.persona.id,
              nombres: LinCot.cotizacion.vehiculo.cliente.persona.nombres,
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
        },
        cobertura: {
          id: LinCot.cobertura.id,
          nombre: LinCot.cobertura.nombre,
          descripcion: LinCot.cobertura.descripcion,
          recargoPorAtraso: LinCot.cobertura.recargoPorAtraso,
        },
      }));
      return BaseService.success(res, finalLineasCotizacion);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener la linea");
    }
  }
}

cron.schedule("0 0 * * *", async () => {
  const hoy = new Date();

  await Cotizacion.update(
    { activo: false },
    {
      where: {
        fechaVencimiento: { [Op.lt]: hoy },
        activo: true,
      },
    }
  );

  console.log("Estados de cotizaciones actualizadas:", hoy);
});
