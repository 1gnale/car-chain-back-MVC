import { Request, Response } from "express";
import ConfiguracionLocalidad from "../models/ConfigLocalidad";
import { BaseService } from "../services/BaseService";
import { Op } from "sequelize";
import { Localidad, Provincia } from "../models";

export class ConfiguracionLocalidadController {
  static async getAllConfiguracionLocalidad(req: Request, res: Response) {
    try {
      const configuracionLocalidad = await ConfiguracionLocalidad.findAll({
        order: [["localidad_id", "ASC"]],
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
      });

      const configTotal = configuracionLocalidad.map((cfg: any) => ({
        id: cfg.id,
        nombre: cfg.nombre,
        descuento: cfg.descuento,
        ganancia: cfg.ganancia,
        recargo: cfg.recargo,
        activo: cfg.activo,
        localidad: {
          id: cfg.localidad.id,
          descripcion: cfg.localidad.descripcion,
          codigoPostal: cfg.localidad.codigoPostal,
          activo: cfg.localidad.activo,
          provincia: {
            id: cfg.localidad.provincia.id,
            descripcion: cfg.localidad.provincia.descripcion,
            activo: cfg.localidad.provincia.activo,
          },
        },
      }));

      return BaseService.success(
        res,
        configTotal,
        "ConfiguracionLocalidad obtenidas exitosamente",
        configTotal.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las ConfiguracionLocalidad"
      );
    }
  }

  static async createConfiguracionLocalidad(req: Request, res: Response) {
    try {
      const { nombre, descuento, ganancia, recargo, localidad_id } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la ConfiguracionLocalidad es requerida",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!descuento) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descuento de la ConfiguracionLocalidad es requerida",
              path: "descuento",
            },
          ],
        } as any);
      }
      if (!ganancia) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La ganancia de la ConfiguracionLocalidad es requerida",
              path: "ganancia",
            },
          ],
        } as any);
      }
      if (!recargo) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El descuento de la ConfiguracionLocalidad es requerida",
              path: "descuento",
            },
          ],
        } as any);
      }
      if (!ganancia) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La ganancia de la ConfiguracionLocalidad es requerida",
              path: "ganancia",
            },
          ],
        } as any);
      }
      if (!recargo) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El recargo de la ConfiguracionLocalidad es requerida",
              path: "recargo",
            },
          ],
        } as any);
      }
      if (!localidad_id) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La localidad_id de la ConfiguracionLocalidad es requerida",
              path: "localidad_id",
            },
          ],
        } as any);
      }
      // Validar que no existan configuraciones activas con la misma localidad
      const overlap = await ConfiguracionLocalidad.findOne({
        where: {
          activo: true, // si tenés un campo activa = true/false
          [Op.and]: [{ localidad_id: { [Op.eq]: localidad_id } }],
        },
      });

      if (overlap) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La Localidad se solapa con otra configuración activa",
              path: "Localidad",
            },
          ],
        } as any);
      }

      const configuracionLocalidad = await ConfiguracionLocalidad.create({
        nombre,
        descuento,
        ganancia,
        recargo,
        localidad_id,
        activo: true,
      });

      return BaseService.created(
        res,
        configuracionLocalidad,
        "ConfiguracionLocalidad creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la ConfiguracionLocalidad"
      );
    }
  }

  static async getConfiguracionLocalidadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configuracionLocalidad = await ConfiguracionLocalidad.findByPk(id, {
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
      });

      if (!configuracionLocalidad) {
        return BaseService.notFound(
          res,
          "ConfiguracionLocalidad no encontrada"
        );
      }

      const localidad = await Localidad.findByPk(
        configuracionLocalidad.localidad_id
      );

      if (!localidad) {
        return BaseService.notFound(res, "localidad no encontrada");
      }

      const provincia = await Provincia.findByPk(localidad.provincia_id);

      if (!provincia) {
        return BaseService.notFound(res, "provincia no encontrada");
      }

      const configTotal = {
        id: configuracionLocalidad.id,
        nombre: configuracionLocalidad.nombre,
        descuento: configuracionLocalidad.descuento,
        ganancia: configuracionLocalidad.ganancia,
        recargo: configuracionLocalidad.recargo,
        activo: configuracionLocalidad.activo,
        localidad: {
          id: localidad.id,
          descripcion: localidad.descripcion,
          codigoPostal: localidad.codigoPostal,
          activo: localidad.activo,
          provincia: {
            id: provincia.id,
            descripcion: provincia.descripcion,
            activo: provincia.activo,
          },
        },
      };

      return BaseService.success(res, configTotal);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la ConfiguracionLocalidad"
      );
    }
  }

  static async getConfiguracionLocalidadByLocality(
    req: Request,
    res: Response
  ) {
    try {
      const { localityId } = req.params;

      const configuracionLocalidad = await ConfiguracionLocalidad.findOne({
        where: {
          activo: true,
          localidad_id: { [Op.eq]: localityId },
        },
      });

      if (!configuracionLocalidad) {
        return BaseService.notFound(
          res,
          "ConfiguracionLocalidad no encontrada"
        );
      }

      const localidad = await Localidad.findByPk(
        configuracionLocalidad.localidad_id
      );

      if (!localidad) {
        return BaseService.notFound(res, "localidad no encontrada");
      }

      const provincia = await Provincia.findByPk(localidad.provincia_id);

      if (!provincia) {
        return BaseService.notFound(res, "provincia no encontrada");
      }

      const configTotal = {
        id: configuracionLocalidad.id,
        nombre: configuracionLocalidad.nombre,
        descuento: configuracionLocalidad.descuento,
        ganancia: configuracionLocalidad.ganancia,
        recargo: configuracionLocalidad.recargo,
        activo: configuracionLocalidad.activo,
        localidad: {
          id: localidad.id,
          descripcion: localidad.descripcion,
          codigoPostal: localidad.codigoPostal,
          activo: localidad.activo,
          provincia: {
            id: provincia.id,
            descripcion: provincia.descripcion,
            activo: provincia.activo,
          },
        },
      };

      return BaseService.success(res, configTotal);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la ConfiguracionLocalidad"
      );
    }
  }

  static async updateConfiguracionLocalidad(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descuento, ganancia, recargo, localidad_id, activo } =
        req.body;

      const configuracionLocalidad = await ConfiguracionLocalidad.findByPk(id);

      if (!configuracionLocalidad) {
        return BaseService.notFound(
          res,
          "ConfiguracionLocalidad no encontrada"
        );
      }

      // Validar que no existan configuraciones activas con solapamiento
      if (activo) {
        const overlap = await ConfiguracionLocalidad.findOne({
          where: {
            activo: true, // si tenés un campo activa = true/false
            [Op.and]: [{ localidad_id: { [Op.eq]: localidad_id } }],
          },
        });

        if (overlap) {
          return BaseService.validationError(res, {
            array: () => [
              {
                msg: "La localidad se solapa con otra configuración activa",
                path: "localidad_id",
              },
            ],
          } as any);
        }
      }

      const configuracionLocalidadModificada =
        await configuracionLocalidad.update({
          nombre,
          descuento,
          ganancia,
          recargo,
          localidad_id,
          activo,
        });

      return BaseService.success(
        res,
        configuracionLocalidadModificada,
        "ConfiguracionLocalidad actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la ConfiguracionLocalidad"
      );
    }
  }

  static async deleteConfiguracionLocalidad(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const configuracionLocalidad = await ConfiguracionLocalidad.findByPk(id);

      if (!configuracionLocalidad) {
        return BaseService.notFound(
          res,
          "ConfiguracionLocalidad no encontrada"
        );
      }

      const configuracionLocalidadEliminada =
        await configuracionLocalidad.update({
          activo: false,
        });

      return BaseService.success(
        res,
        configuracionLocalidadEliminada,
        "ConfiguracionLocalidad eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la ConfiguracionLocalidad"
      );
    }
  }
}
