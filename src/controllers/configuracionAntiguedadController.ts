import { Request, Response } from "express";
import ConfiguracionAntiguedad from "../models/ConfigAntiguedad";
import { BaseService } from "../services/BaseService";
import { Op } from "sequelize";

export class ConfiguracionAntiguedadController {
  static async getAllConfiguracionAntiguedad(req: Request, res: Response) {
    try {
      const configuracionAntiguedad = await ConfiguracionAntiguedad.findAll({
        order: [["minima", "ASC"]],
      });

      return BaseService.success(
        res,
        configuracionAntiguedad,
        "ConfiguracionAntiguedad obtenidas exitosamente",
        configuracionAntiguedad.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las ConfiguracionAntiguedad"
      );
    }
  }

  static async createConfiguracionAntiguedad(req: Request, res: Response) {
    try {
      const { nombre, minima, maxima, descuento, ganancia, recargo } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la ConfiguracionAntiguedad es requerida",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!minima) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La minima de la ConfiguracionAntiguedad es requerida",
              path: "minima",
            },
          ],
        } as any);
      }
      if (!maxima) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La maxima de la ConfiguracionAntiguedad es requerida",
              path: "maxima",
            },
          ],
        } as any);
      }
      if (!descuento) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descuento de la ConfiguracionAntiguedad es requerida",
              path: "descuento",
            },
          ],
        } as any);
      }
      if (!ganancia) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La ganancia de la ConfiguracionAntiguedad es requerida",
              path: "ganancia",
            },
          ],
        } as any);
      }
      if (!recargo) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El recargo de la ConfiguracionAntiguedad es requerida",
              path: "recargo",
            },
          ],
        } as any);
      }

      // Validar que no existan configuraciones activas con solapamiento
      const overlap = await ConfiguracionAntiguedad.findOne({
        where: {
          activo: true, // si tenés un campo activa = true/false
          [Op.or]: [
            {
              // caso: la mínima nueva cae dentro de un rango existente
              [Op.and]: [
                { minima: { [Op.lte]: minima } },
                { maxima: { [Op.gte]: minima } },
              ],
            },
            {
              // caso: la máxima nueva cae dentro de un rango existente
              [Op.and]: [
                { minima: { [Op.lte]: maxima } },
                { maxima: { [Op.gte]: maxima } },
              ],
            },
            {
              // caso: el rango nuevo envuelve completamente a otro rango
              [Op.and]: [
                { minima: { [Op.gte]: minima } },
                { maxima: { [Op.lte]: maxima } },
              ],
            },
          ],
        },
      });

      if (overlap) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El rango de antiguedad se solapa con otra configuración activa",
              path: "minima/maxima",
            },
          ],
        } as any);
      }

      const configuracionAntiguedad = await ConfiguracionAntiguedad.create({
        nombre,
        minima,
        maxima,
        descuento,
        ganancia,
        recargo,
        activo: true,
      });

      return BaseService.created(
        res,
        configuracionAntiguedad,
        "ConfiguracionAntiguedad creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la ConfiguracionAntiguedad"
      );
    }
  }

  static async getConfiguracionAntiguedadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configuracionAntiguedad = await ConfiguracionAntiguedad.findByPk(
        id
      );

      if (!configuracionAntiguedad) {
        return BaseService.notFound(
          res,
          "ConfiguracionAntiguedad no encontrada"
        );
      }

      return BaseService.success(res, configuracionAntiguedad);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la ConfiguracionAntiguedad"
      );
    }
  }

  static async getConfiguracionAntiguedadByAge(req: Request, res: Response) {
    try {
      const { age } = req.params;

      const configuracionAntiguedad = await ConfiguracionAntiguedad.findOne({
        where: {
          activo: true,
          minima: { [Op.lte]: age }, // edad >= minima
          maxima: { [Op.gte]: age }, // edad <= maxima
        },
      });

      if (!configuracionAntiguedad) {
        return BaseService.notFound(
          res,
          "configuracionAntiguedad no encontrada"
        );
      }

      return BaseService.success(res, configuracionAntiguedad);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la configuracionAntiguedad"
      );
    }
  }

  static async updateConfiguracionAntiguedad(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, minima, maxima, descuento, ganancia, recargo, activo } =
        req.body;

      const configuracionAntiguedad = await ConfiguracionAntiguedad.findByPk(
        id
      );

      if (!configuracionAntiguedad) {
        return BaseService.notFound(
          res,
          "ConfiguracionAntiguedad no encontrada"
        );
      }

      // Validar que no existan configuraciones activas con solapamiento
      if (activo) {
        const overlap = await ConfiguracionAntiguedad.findOne({
          where: {
            id: { [Op.ne]: id }, // excluye la misma config
            activo: true,
            [Op.and]: [
              { minima: { [Op.lte]: maxima } }, // nueva mínima <= existente máxima
              { maxima: { [Op.gte]: minima } }, // nueva máxima >= existente mínima
            ],
          },
        });

        if (overlap) {
          return BaseService.validationError(res, {
            array: () => [
              {
                msg: "El rango de antiguedad se solapa con otra configuración activa",
                path: "minima/maxima",
              },
            ],
          } as any);
        }
      }

      const configuracionAntiguedadModificada =
        await configuracionAntiguedad.update({
          nombre,
          minima,
          maxima,
          descuento,
          ganancia,
          recargo,
          activo,
        });

      return BaseService.success(
        res,
        configuracionAntiguedadModificada,
        "ConfiguracionAntiguedad actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la ConfiguracionAntiguedad"
      );
    }
  }

  static async deleteConfiguracionAntiguedad(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const configuracionAntiguedad = await ConfiguracionAntiguedad.findByPk(
        id
      );

      if (!configuracionAntiguedad) {
        return BaseService.notFound(
          res,
          "ConfiguracionAntiguedad no encontrada"
        );
      }

      const configuracionAntiguedadEliminada =
        await configuracionAntiguedad.update({
          activo: false,
        });

      return BaseService.success(
        res,
        configuracionAntiguedadEliminada,
        "ConfiguracionAntiguedad eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la ConfiguracionAntiguedad"
      );
    }
  }
}
