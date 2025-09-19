import { Request, Response } from "express";
import PeriodoPago from "../models/PeriodoPago";
import { BaseService } from "../services/BaseService";

import {
  Cliente,
  Cobertura,
  Cotizacion,
  Documentacion,
  LineaCotizacion,
  Localidad,
  Marca,
  Modelo,
  Pago,
  Persona,
  Provincia,
  Revision,
  Siniestro,
  TipoContratacion,
  Usuario,
  Vehiculo,
  Version,
} from "../models";
import Poliza, { EstadoPoliza } from "../models/Poliza";
import { EstadoSiniestro } from "../models/Siniestro";
import { EstadoRevision } from "../models/Revision";

import cron from "node-cron";
import { Op } from "sequelize";

export class PolizaController {
  // HU 9.2 y HU 10 --- El backend debe ser capaz de guardar la documentación de la póliza
  static async createDocumentacion(req: Request, res: Response) {
    try {
      const {
        fotoFrontal,
        fotoTrasera,
        fotoLateral1,
        fotoLateral2,
        fotoTecho,
        cedulaVerde,
      } = req.body;

      // Lista de campos obligatorios
      const campos = {
        fotoFrontal,
        fotoTrasera,
        fotoLateral1,
        fotoLateral2,
        fotoTecho,
        cedulaVerde,
      };
      // Validación: campos requeridos
      for (const [key, value] of Object.entries(campos)) {
        if (!value) {
          return BaseService.validationError(res, {
            array: () => [{ msg: `El campo ${key} es requerido`, path: key }],
          } as any);
        }

        let base64Data = value;

        // Si viene con encabezado tipo data:image/...
        if (value.startsWith("data:")) {
          if (!value.startsWith("data:image/")) {
            return BaseService.validationError(res, {
              array: () => [
                { msg: `El campo ${key} debe contener una imagen`, path: key },
              ],
            } as any);
          }

          // Cortar el encabezado y quedarnos con la parte después de la coma
          const parts = value.split(",");
          if (parts.length !== 2) {
            return BaseService.validationError(res, {
              array: () => [
                { msg: `El campo ${key} tiene un formato inválido`, path: key },
              ],
            } as any);
          }
          base64Data = parts[1];
        }

        // Validar que la parte base64 sea válida
        const base64Regex =
          /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!base64Regex.test(base64Data)) {
          return BaseService.validationError(res, {
            array: () => [
              {
                msg: `El campo ${key} debe ser una cadena base64 válida`,
                path: key,
              },
            ],
          } as any);
        }
      }

      // Crear el registro en la base
      const nuevaDocumentacion = await Documentacion.create({
        fotoFrontal: Buffer.from(
          fotoFrontal.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        fotoTrasera: Buffer.from(
          fotoTrasera.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        fotoLateral1: Buffer.from(
          fotoLateral1.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        fotoLateral2: Buffer.from(
          fotoLateral2.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        fotoTecho: Buffer.from(
          fotoTecho.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        cedulaVerde: Buffer.from(
          cedulaVerde.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
      });

      return BaseService.created(
        res,
        nuevaDocumentacion,
        "Documentación creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la Documentación"
      );
    }
  }

  // HU 9.2 --- El backend debe ser capaz de obtener la documentación de la póliza.
  static async getDocumentacionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const documentacion = await Documentacion.findByPk(id);

      if (!documentacion) {
        return BaseService.notFound(res, "documentacion no encontrada");
      }

      return BaseService.success(res, documentacion);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la documentacion"
      );
    }
  }
  // HU 9.2 y HU 10  --- El backend debe ser capaz de guardar la póliza con estado "Pendiente"
  static async createPoliza(req: Request, res: Response) {
    try {
      const { documentacion_id, lineaCotizacion_id } = req.body;

      const lineaCotizacion = await LineaCotizacion.findByPk(
        lineaCotizacion_id
      );
      if (!lineaCotizacion) {
        return BaseService.notFound(res, "lineaCotizacion no encontrado");
      }

      const nuevaPoliza = await Poliza.create({
        documentacion_id,
        lineaCotizacion_id,
        renovacionAutomatica: false,
        estadoPoliza: EstadoPoliza.PENDIENTE,
      });

      return BaseService.created(
        res,
        nuevaPoliza,
        "Poliza creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear la Poliza");
    }
  }

  // HU 11 --- El backend debe ser capaz de devolver una lista con todas las polizas (Datos de poliza a traer: N° poliza, cobertura, titular, vehiculo, fecha de creacion y estado).
  static async getAllPolizas(req: Request, res: Response) {
    try {
      const polizas = await Poliza.findAll({
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
              },
              {
                model: Cobertura,
                as: "cobertura",
              },
            ],
          },
        ],
      });

      if (!polizas) {
        return BaseService.notFound(res, "polizas no encontradas");
      }

      const finalPolizas = polizas.map((poliza: any) => ({
        numeroPoliza: poliza.numero_poliza,
        cobertura: poliza.lineaCotizacion.cobertura.nombre,
        titular:
          poliza.lineaCotizacion.cotizacion.vehiculo.cliente.persona.apellido +
          ", " +
          poliza.lineaCotizacion.cotizacion.vehiculo.cliente.persona.nombres,
        vehiculo: poliza.lineaCotizacion.cotizacion.vehiculo.version.nombre,
        fechaContratacion: poliza.fechaContratacion,
        estado: poliza.estadoPoliza,
      }));

      return BaseService.success(
        res,
        finalPolizas,
        "Polizas obtenidas exitosamente",
        finalPolizas.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las Polizas"
      );
    }
  }
  /// HU 11/12/18.1/18.2/18.3/18.4 --- El backend debe ser capaz de devolver una poliza en especifico (Datos de la poliza a traer: Todos).
  static async getPolizaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const poliza = await Poliza.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            include: [{ model: Persona, as: "persona" }],
          },
          { model: PeriodoPago, as: "periodoPago" },
          { model: TipoContratacion, as: "tipoContratacion" },
          //{model: Documentacion, as:"documentaicon"}, ESTO NOSE XD
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
              },
              {
                model: Cobertura,
                as: "cobertura",
              },
            ],
          },
        ],
      });

      if (!poliza) {
        return BaseService.notFound(res, "Poliza no encontrada");
      }

      const lineaCotizacion = await LineaCotizacion.findByPk(
        poliza.lineaCotizacion_id
      );
      if (!lineaCotizacion) {
        return BaseService.notFound(res, "lineaCotizacion no encontrada");
      }
      const cotizacion = await Cotizacion.findByPk(
        lineaCotizacion.cotizacion_id
      );
      if (!cotizacion) {
        return BaseService.notFound(res, "cotizacion no encontrada");
      }
      const vehiculo = await Vehiculo.findByPk(cotizacion.vehiculo_id);
      if (!vehiculo) {
        return BaseService.notFound(res, "cotizacion no encontrada");
      }
      const version = await Version.findByPk(vehiculo.version_id);
      if (!version) {
        return BaseService.notFound(res, "version no encontrada");
      }
      const modelo = await Modelo.findByPk(version.modelo_id);
      if (!modelo) {
        return BaseService.notFound(res, "modelo no encontrada");
      }
      const marca = await Marca.findByPk(modelo.marca_id);
      if (!marca) {
        return BaseService.notFound(res, "marca no encontrada");
      }

      const cliente = await Cliente.findByPk(vehiculo.cliente_id);
      if (!cliente) {
        return BaseService.notFound(res, "cliente no encontrada");
      }
      const persona = await Persona.findByPk(cliente.persona_id);
      if (!persona) {
        return BaseService.notFound(res, "persona no encontrada");
      }
      const localidad = await Localidad.findByPk(persona.localidad_id);
      if (!localidad) {
        return BaseService.notFound(res, "localidad no encontrada");
      }
      const provincia = await Provincia.findByPk(localidad.provincia_id);
      if (!provincia) {
        return BaseService.notFound(res, "provincia no encontrada");
      }
      const cobertura = await Cobertura.findByPk(lineaCotizacion.cobertura_id);
      if (!cobertura) {
        return BaseService.notFound(res, "cobertura no encontrada");
      }

      const periodoPago = await PeriodoPago.findByPk(poliza.periodoPago_id);
      const tipoContratacion = await TipoContratacion.findByPk(
        poliza.tipoContratacion_id
      );

      const documentacion = await Documentacion.findByPk(
        poliza.documentacion_id
      );
      if (!documentacion) {
        return BaseService.notFound(res, "documentacion no encontrada");
      }

      const usuario = await Usuario.findByPk(poliza.usuario_legajo);

      const personaUsuario = await Persona.findByPk(usuario?.persona_id);

      const finalPoliza = {
        numeroPoliza: poliza.numero_poliza,
        precioPolizaActual: poliza.precioPolizaActual,
        montoAsegurado: poliza.montoAsegurado,
        fechaContratacion: poliza.fechaContratacion,
        horaContratacion: poliza.horaContratacion,
        fechaVencimiento: poliza.fechaVencimiento,
        fechaCancelacion: poliza.fechaCancelacion,
        renovacionAutomatica: poliza.renovacionAutomatica,
        estadoPoliza: poliza.estadoPoliza,
        usuario: {
          id: personaUsuario?.id,
          nombres: personaUsuario?.nombres,
          apellido: personaUsuario?.apellido,
          fechaNacimiento: personaUsuario?.fechaNacimiento,
          tipoDocumento: personaUsuario?.tipoDocumento,
          documento: personaUsuario?.documento,
          domicilio: personaUsuario?.domicilio,
          correo: personaUsuario?.correo,
          telefono: personaUsuario?.telefono,
          sexo: personaUsuario?.sexo,
        },
        documentacion: {
          id: documentacion.id,
          fotoFrontal: documentacion.fotoFrontal,
          fotoTrasera: documentacion.fotoTrasera,
          fotoLateral1: documentacion.fotoLateral1,
          fotoLateral2: documentacion.fotoLateral2,
          fotoTecho: documentacion.fotoTecho,
          cedulaVerde: documentacion.cedulaVerde,
        },
        periodoPago: periodoPago,
        tipoContratacion: tipoContratacion,
        LineaCotizacion: {
          id: lineaCotizacion.id,
          monto: lineaCotizacion.monto,
          cotizacion: {
            id: cotizacion.id,
            fechaCreacion: cotizacion.fechaCreacion,
            fechaVencimiento: cotizacion.fechaVencimiento,
            vehiculo: {
              chasis: vehiculo.chasis,
              matricula: vehiculo.matricula,
              año_fabricacion: vehiculo.añoFabricacion,
              numero_motor: vehiculo.numeroMotor,
              gnc: vehiculo.gnc,
              version: {
                id: version.id,
                nombre: version.nombre,
                descripcion: version.descripcion,
                precio_mercado: version.precio_mercado,
                precio_mercado_gnc: version.precio_mercado_gnc,
                modelo: {
                  id: modelo.id,
                  nombre: modelo.nombre,
                  descripcion: modelo.descripcion,
                  marca: {
                    id: marca.id,
                    nombre: marca.nombre,
                    descripcion: marca.descripcion,
                  },
                },
              },
              cliente: {
                idClient: cliente.idClient,
                id: persona.id,
                nombres: persona.nombres,
                apellido: persona.apellido,
                fechaNacimiento: persona.fechaNacimiento,
                tipoDocumento: persona.tipoDocumento,
                documento: persona.documento,
                domicilio: persona.domicilio,
                correo: persona.correo,
                telefono: persona.telefono,
                sexo: persona.sexo,
                localidad: {
                  id: localidad.id,
                  descripcion: localidad.descripcion,
                  codigoPostal: localidad.codigoPostal,
                  provincia: {
                    id: provincia.id,
                    descripcion: provincia.descripcion,
                  },
                },
              },
            },
          },
          cobertura: {
            id: cobertura.id,
            nombre: cobertura.nombre,
            descripcion: cobertura.descripcion,
            recargoPorAtraso: cobertura.recargoPorAtraso,
          },
        },
      };

      return BaseService.success(res, finalPoliza);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener la poliza");
    }
  }
  // HU 11/12 --- El backend debe ser capaz de cambiar el estadoPoliza a aprobado o rechazado (La enumeracion).
  static async updateStatePoliza(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estadoPoliza } = req.body;

      const poliza = await Poliza.findByPk(id);

      if (!poliza) {
        return BaseService.notFound(res, "poliza no encontrada");
      }

      const polizaModificada = await poliza.update({
        estadoPoliza: estadoPoliza as EstadoPoliza,
      });

      return BaseService.success(
        res,
        polizaModificada,
        "Poliza actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Poliza"
      );
    }
  }
  // HU 11 --- El backend debe asignar al empleado que cambio el estado de la poliza a la poliza
  static async updateUsuarioPoliza(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { usuario_legajo } = req.body;

      const poliza = await Poliza.findByPk(id);

      if (!poliza) {
        return BaseService.notFound(res, "poliza no encontrada");
      }

      const polizaModificada = await poliza.update({
        usuario_legajo: usuario_legajo,
      });

      return BaseService.success(
        res,
        polizaModificada,
        "Poliza actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Poliza"
      );
    }
  }
  // HU 12 --- El backend debe ser capaz guardar una revision.
  static async createRevision(req: Request, res: Response) {
    try {
      const { usuario_legajo, fecha, hora, poliza_numero, estado } = req.body;

      if (!fecha || !hora || !estado) {
        const errores: { msg: string; path: string }[] = [];

        if (!fecha)
          errores.push({
            msg: "La fecha de la revision es requerida",
            path: "fecha",
          });
        if (!hora)
          errores.push({
            msg: "La hora de la revision es requerida",
            path: "hora",
          });
        if (!estado)
          errores.push({
            msg: "El estado de la revision es requerido",
            path: "estado",
          });

        return BaseService.validationError(res, {
          array: () => errores,
        } as any);
      }

      const poliza = await Poliza.findByPk(poliza_numero);

      if (!poliza) {
        return BaseService.notFound(res, "poliza no encontrada");
      }

      const nuevaRevision = await Revision.create({
        usuario_legajo,
        fecha,
        hora,
        poliza_numero,
        estado: estado as EstadoRevision,
      });

      const polizaModificada = await poliza.update({
        estadoPoliza: estado as EstadoPoliza,
      });

      return BaseService.created(
        res,
        nuevaRevision,
        "nuevaRevision creada exitosamente y Poliza actualizada"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la nuevaRevision"
      );
    }
  }

  // HU 18.1/18.2/18.3/18.4 --- El backend debe ser capaz de devolver una lista de todas las polizas del cliente (Datos de poliza a traer: N° Poliza, cobertura, fecha de contratacion, hora de contracion, estado).
  static async getAllPolizasByClientID(req: Request, res: Response) {
    try {
      const { mail } = req.params;

      const cliente = await Cliente.findOne({
        include: [{ model: Persona, as: "persona", where: { correo: mail } }],
      });

      const polizas = await Poliza.findAll({
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
                    ],
                  },
                ],
              },
              {
                model: Cobertura,
                as: "cobertura",
              },
            ],
          },
        ],
        where: {
          "$lineaCotizacion.cotizacion.vehiculo.cliente_id$": cliente?.idClient,
        },
      });

      if (!polizas) {
        return BaseService.notFound(res, "polizas no encontradas");
      }

      const finalPoliza = polizas.map((poliza: any) => ({
        numero_poliza: poliza.numero_poliza,
        lineaCotizacion: {
          id: poliza.lineaCotizacion.id,
          cobertura: poliza.lineaCotizacion.cobertura,
        },
        fechaContratacion: poliza.fechaContratacion,
        estadoPoliza: poliza.estadoPoliza,
      }));

      return BaseService.success(
        res,
        finalPoliza,
        "Polizas obtenidas exitosamente",
        finalPoliza.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las Polizas"
      );
    }
  }

  // HU 18.1 --- El backend debe ser capaz de guardar los datos el siniestro con estado "Pendiente"
  static async createSiniestro(req: Request, res: Response) {
    try {
      const {
        poliza_numero,
        horaSiniestro,
        fechaSiniestro,
        fotoDenuncia,
        fotoVehiculo,
      } = req.body;

      const polizaDb = await Poliza.findByPk(poliza_numero);
      if (!polizaDb) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La poliza no es encontrada",
              path: "poliza",
            },
          ],
        } as any);
      }
      if (polizaDb.estadoPoliza == EstadoPoliza.VIGENTE) {
        if (!horaSiniestro) {
          return BaseService.validationError(res, {
            array: () => [
              {
                msg: "La horaSiniestro del siniesto es requerida",
                path: "horaSiniestro",
              },
            ],
          } as any);
        }
        if (!fechaSiniestro) {
          return BaseService.validationError(res, {
            array: () => [
              {
                msg: "La fechaSiniestro del siniesto es requerida",
                path: "fechaSiniestro",
              },
            ],
          } as any);
        }

        const campos = {
          fotoDenuncia,
          fotoVehiculo,
        };
        // Validación: campos requeridos
        for (const [key, value] of Object.entries(campos)) {
          if (!value) {
            return BaseService.validationError(res, {
              array: () => [{ msg: `El campo ${key} es requerido`, path: key }],
            } as any);
          }

          // Validar que sea base64
          const base64Regex =
            /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
          if (!base64Regex.test(value)) {
            return BaseService.validationError(res, {
              array: () => [
                {
                  msg: `El campo ${key} debe ser una cadena base64 válida`,
                  path: key,
                },
              ],
            } as any);
          }
          // Validar que corresponda a imagen (si viene con encabezado data:image)
          if (value.startsWith("data:")) {
            if (!value.startsWith("data:image/")) {
              return BaseService.validationError(res, {
                array: () => [
                  {
                    msg: `El campo ${key} debe contener una imagen`,
                    path: key,
                  },
                ],
              } as any);
            }
          }
        }

        const nuevoSiniesto = await Siniestro.create({
          poliza_numero,
          horaSiniestro,
          fechaSiniestro,
          fotoDenuncia: Buffer.from(
            fotoDenuncia.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          fotoVehiculo: Buffer.from(
            fotoVehiculo.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          estado: EstadoSiniestro.PENDIENTE,
        });

        return BaseService.created(
          res,
          nuevoSiniesto,
          "nuevoSiniesto creada exitosamente"
        );
      } else {
        return BaseService.serverError(res, "Su poliza no esta vigente");
      }
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la nuevoSiniesto"
      );
    }
  }

  // HU 18.3 --- El backend debe ser capaz de devolver una lista de pagos de una póliza especifica (Datos de pagos: Todos).
  static async getAllPagosPoliza(req: Request, res: Response) {
    try {
      const { numeroPoliza } = req.params;
      const pagos = await Pago.findAll({
        include: [
          {
            model: Poliza,
            as: "poliza",
            where: { numero_poliza: numeroPoliza },
          },
        ],
      });

      if (!pagos) {
        return BaseService.notFound(res, "pagos no encontrados");
      }

      const finalPagos = pagos.map((pago: any) => ({
        id: pago.id,
        fecha: pago.fecha,
        hora: pago.hora,
        total: pago.total,
      }));

      return BaseService.success(
        res,
        finalPagos,
        "Pagos obtenidas exitosamente",
        finalPagos.length
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener los pagos");
    }
  }

  // HU 18.4 --- El backend debe ser capaz de devolver una lista de los siniestros y revisiones de una póliza en especifico. (fecha, hora y estado de cada siniestro/revision).
  static async getAllSiniestrosYRevisiones(req: Request, res: Response) {
    try {
      const { numeroPoliza } = req.params;

      const siniestros = await Siniestro.findAll({
        include: [
          {
            model: Poliza,
            as: "poliza",
            where: { numero_poliza: numeroPoliza },
          },
        ],
      });
      const revisiones = await Revision.findAll({
        include: [
          {
            model: Poliza,
            as: "poliza",
            where: { numero_poliza: numeroPoliza },
          },
        ],
      });

      const finalSiniestro = siniestros.map((siniestro: any) => ({
        id: siniestro.id,
        fecha: siniestro.fechaSiniestro,
        hora: siniestro.horaSiniestro,
        estado: siniestro.estado,
      }));
      const finalRevision = revisiones.map((revision: any) => ({
        id: revision.id,
        fecha: revision.fecha,
        hora: revision.hora,
        estado: revision.estado,
      }));

      const finalData = {
        siniestros: finalSiniestro,
        revisiones: finalRevision,
      };

      return BaseService.success(
        res,
        finalData,
        "Siniestros y Revisiones obtenidas exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los Siniestros y Revisiones"
      );
    }
  }
  // 18.4 --- El backend debe ser capaz de devolver un siniestro en especifico (Datos: Todos)
  static async getSiniestroById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const siniesto = await Siniestro.findByPk(id);

      if (!siniesto) {
        return BaseService.notFound(res, "siniesto no encontrada");
      }
      const finalSiniestro = {
        id: siniesto.id,
        fecha: siniesto.fechaSiniestro,
        hora: siniesto.horaSiniestro,
        estado: siniesto.estado,
        denuncia: siniesto.fotoDenuncia,
        vehiculo: siniesto.fotoVehiculo,
      };

      return BaseService.success(res, finalSiniestro);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener el siniestro"
      );
    }
  }

  // HU 18.4 --- El backend debe ser capaz de devolver una revision en especifico (Datos: Todos)
  static async getRevisionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const revision = await Revision.findByPk(id);

      if (!revision) {
        return BaseService.notFound(res, "revision no encontrada");
      }
      const finalRevision = {
        id: revision.id,
        fecha: revision.fecha,
        hora: revision.hora,
        estado: revision.estado,
      };

      return BaseService.success(res, finalRevision);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la revision"
      );
    }
  }

  // HU 18.4 --- El backend debe ser capaz de devolver la documentación de la póliza en especifico.
  static async getDocumentacionByPoliza(req: Request, res: Response) {
    try {
      const { numeroPoliza } = req.params;
      const poliza = await Poliza.findOne({
        where: { numero_poliza: numeroPoliza },
      });

      if (!poliza) {
        return BaseService.notFound(res, "poliza no encontrada");
      }

      const documentacion = await Documentacion.findOne({
        where: { id: poliza.documentacion_id },
      });

      if (!documentacion) {
        return BaseService.notFound(res, "documentacion no encontrada");
      }
      return BaseService.success(res, documentacion);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la documentacion"
      );
    }
  }

  // HU 19 --- El backend debe ser capaz de devolver una lista con todas los siniestros (Datos del siniestro a traer: N° poliza, cobertura, titular, vehiculo, fecha, hora y estado).
  static async getAllSiniestros(req: Request, res: Response) {
    try {
      const siniestos = await Siniestro.findAll({
        order: [["fechaSiniestro", "DESC"]],
        include: [
          {
            model: Poliza,
            as: "poliza",
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
                  },
                  {
                    model: Cobertura,
                    as: "cobertura",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!siniestos) {
        return BaseService.notFound(res, "siniesto no encontrada");
      }

      const finalSiniestro = siniestos.map((siniesto: any) => ({
        id: siniesto.poliza_numero,
        fecha: siniesto.fechaSiniestro,
        hora: siniesto.horaSiniestro,
        estado: siniesto.estado,
        vehiculo: siniesto.poliza.lineaCotizacion.cotizacion.vehiculo,
        titular:
          siniesto.poliza.lineaCotizacion.cotizacion.vehiculo.cliente.persona
            .nombres,
        cobertura: siniesto.poliza.lineaCotizacion.cobertura.nombre,
      }));

      return BaseService.success(res, finalSiniestro);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener el siniestro"
      );
    }
  }
  // HU 19: El backend debe ser capaz de devolver un siniestro en especifico (Datos del siniestro a traer: Todos los del siniestro y la poliza).
  static async getAllDataSiniestroById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const siniesto = await Siniestro.findByPk(id, {
        include: [
          {
            model: Poliza,
            as: "poliza",
          },
        ],
      });

      if (!siniesto) {
        return BaseService.notFound(res, "siniesto no encontrado");
      }

      const poliza = await Poliza.findByPk(siniesto.poliza_numero);
      if (!poliza) {
        return BaseService.notFound(res, "Poliza no encontrada");
      }

      const lineaCotizacion = await LineaCotizacion.findByPk(
        poliza.lineaCotizacion_id
      );
      if (!lineaCotizacion) {
        return BaseService.notFound(res, "lineaCotizacion no encontrada");
      }
      const cotizacion = await Cotizacion.findByPk(
        lineaCotizacion.cotizacion_id
      );
      if (!cotizacion) {
        return BaseService.notFound(res, "cotizacion no encontrada");
      }
      const vehiculo = await Vehiculo.findByPk(cotizacion.vehiculo_id);
      if (!vehiculo) {
        return BaseService.notFound(res, "cotizacion no encontrada");
      }
      const version = await Version.findByPk(vehiculo.version_id);
      if (!version) {
        return BaseService.notFound(res, "version no encontrada");
      }
      const modelo = await Modelo.findByPk(version.modelo_id);
      if (!modelo) {
        return BaseService.notFound(res, "modelo no encontrada");
      }
      const marca = await Marca.findByPk(modelo.marca_id);
      if (!marca) {
        return BaseService.notFound(res, "marca no encontrada");
      }

      const cliente = await Cliente.findByPk(vehiculo.cliente_id);
      if (!cliente) {
        return BaseService.notFound(res, "cliente no encontrada");
      }
      const persona = await Persona.findByPk(cliente.persona_id);
      if (!persona) {
        return BaseService.notFound(res, "persona no encontrada");
      }
      const localidad = await Localidad.findByPk(persona.localidad_id);
      if (!localidad) {
        return BaseService.notFound(res, "localidad no encontrada");
      }
      const provincia = await Provincia.findByPk(localidad.provincia_id);
      if (!provincia) {
        return BaseService.notFound(res, "provincia no encontrada");
      }
      const cobertura = await Cobertura.findByPk(lineaCotizacion.cobertura_id);
      if (!cobertura) {
        return BaseService.notFound(res, "cobertura no encontrada");
      }

      const periodoPago = await PeriodoPago.findByPk(poliza.periodoPago_id);
      const tipoContratacion = await TipoContratacion.findByPk(
        poliza.tipoContratacion_id
      );

      const documentacion = await Documentacion.findByPk(
        poliza.documentacion_id
      );
      if (!documentacion) {
        return BaseService.notFound(res, "documentacion no encontrada");
      }

      const usuario = await Usuario.findByPk(poliza.usuario_legajo);

      const personaUsuario = await Persona.findByPk(usuario?.persona_id);

      const finalSiniestro = {
        id: siniesto.id,
        fecha: siniesto.fechaSiniestro,
        hora: siniesto.horaSiniestro,
        estado: siniesto.estado,
        fotoDenuncia: siniesto.fotoDenuncia,
        fotoVehiculo: siniesto.fotoVehiculo,
        poliza: {
          numeroPoliza: poliza.numero_poliza,
          precioPolizaActual: poliza.precioPolizaActual,
          montoAsegurado: poliza.montoAsegurado,
          fechaContratacion: poliza.fechaContratacion,
          horaContratacion: poliza.horaContratacion,
          fechaVencimiento: poliza.fechaVencimiento,
          fechaCancelacion: poliza.fechaCancelacion,
          renovacionAutomatica: poliza.renovacionAutomatica,
          estadoPoliza: poliza.estadoPoliza,
          usuario: {
            id: personaUsuario?.id,
            nombres: personaUsuario?.nombres,
            apellido: personaUsuario?.apellido,
            fechaNacimiento: personaUsuario?.fechaNacimiento,
            tipoDocumento: personaUsuario?.tipoDocumento,
            documento: personaUsuario?.documento,
            domicilio: personaUsuario?.domicilio,
            correo: personaUsuario?.correo,
            telefono: personaUsuario?.telefono,
            sexo: personaUsuario?.sexo,
          },
          documentacion: {
            id: documentacion.id,
            fotoFrontal: documentacion.fotoFrontal,
            fotoTrasera: documentacion.fotoTrasera,
            fotoLateral1: documentacion.fotoLateral1,
            fotoLateral2: documentacion.fotoLateral2,
            fotoTecho: documentacion.fotoTecho,
            cedulaVerde: documentacion.cedulaVerde,
          },
          periodoPago: periodoPago,
          tipoContratacion: tipoContratacion,
          LineaCotizacion: {
            id: lineaCotizacion.id,
            monto: lineaCotizacion.monto,
            cotizacion: {
              id: cotizacion.id,
              fechaCreacion: cotizacion.fechaCreacion,
              fechaVencimiento: cotizacion.fechaVencimiento,
              vehiculo: {
                chasis: vehiculo.chasis,
                matricula: vehiculo.matricula,
                año_fabricacion: vehiculo.añoFabricacion,
                numero_motor: vehiculo.numeroMotor,
                gnc: vehiculo.gnc,
                version: {
                  id: version.id,
                  nombre: version.nombre,
                  descripcion: version.descripcion,
                  precio_mercado: version.precio_mercado,
                  precio_mercado_gnc: version.precio_mercado_gnc,
                  modelo: {
                    id: modelo.id,
                    nombre: modelo.nombre,
                    descripcion: modelo.descripcion,
                    marca: {
                      id: marca.id,
                      nombre: marca.nombre,
                      descripcion: marca.descripcion,
                    },
                  },
                },
                cliente: {
                  idClient: cliente.idClient,
                  id: persona.id,
                  nombres: persona.nombres,
                  apellido: persona.apellido,
                  fechaNacimiento: persona.fechaNacimiento,
                  tipoDocumento: persona.tipoDocumento,
                  documento: persona.documento,
                  domicilio: persona.domicilio,
                  correo: persona.correo,
                  telefono: persona.telefono,
                  sexo: persona.sexo,
                  localidad: {
                    id: localidad.id,
                    descripcion: localidad.descripcion,
                    codigoPostal: localidad.codigoPostal,
                    provincia: {
                      id: provincia.id,
                      descripcion: provincia.descripcion,
                    },
                  },
                },
              },
              cobertura: {
                id: cobertura.id,
                nombre: cobertura.nombre,
                descripcion: cobertura.descripcion,
                recargoPorAtraso: cobertura.recargoPorAtraso,
              },
            },
          },
        },
      };

      return BaseService.success(res, finalSiniestro);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener el siniestro"
      );
    }
  }
  // HU 19 --- El backend debe ser capaz de cambiar el estado a aprobado o rechazado (La enumeración).
  static async updateStateSiniestro(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estadoSiniestro } = req.body;

      const siniestro = await Siniestro.findByPk(id);

      if (!siniestro) {
        return BaseService.notFound(res, "siniestro no encontrado");
      }

      const siniestroModificado = await siniestro.update({
        estado: estadoSiniestro as EstadoSiniestro,
      });

      return BaseService.success(
        res,
        siniestroModificado,
        "siniestro actualizado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar siniestro"
      );
    }
  }
}

/// FUNCION QUE ACTUALIZA LOS ESTADOS TODOS LOS DIAS A LAS 00.
// Tarea que corre todos los días a las 00:00
cron.schedule("0 0 * * *", async () => {
  const hoy = new Date();

  await Poliza.update(
    { estadoPoliza: EstadoPoliza.IMPAGA },
    {
      where: {
        fechaDePago: { [Op.lt]: hoy },
        estadoPoliza: EstadoPoliza.VIGENTE,
      },
    }
  );

  console.log("Estados de pólizas actualizados:", hoy);
});
