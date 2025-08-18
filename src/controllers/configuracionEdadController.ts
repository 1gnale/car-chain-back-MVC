import { Request, Response } from "express";
import ConfiguracionEdad from "../models/ConfigEdad";
import { BaseService } from "../services/BaseService";
import { Op } from "sequelize";

export class ConfiguracionEdadController {
  static async getAllConfiguracionEdad(req: Request, res: Response) {
    try {
      const configuracionEdad = await ConfiguracionEdad.findAll({
        order: [["minima", "ASC"]],
      });

      return BaseService.success(
        res,
        configuracionEdad,
        "ConfiguracionEdad obtenidas exitosamente",
        configuracionEdad.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las ConfiguracionEdad"
      );
    }
  }

  static async createConfiguracionEdad(req: Request, res: Response) {
    try {
      const { nombre, minima, maxima, descuento, ganancia, recargo } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la ConfiguracionEdad es requerida",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!minima) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La minima de la ConfiguracionEdad es requerida",
              path: "minima",
            },
          ],
        } as any);
      }
      if (!maxima) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La maxima de la ConfiguracionEdad es requerida",
              path: "maxima",
            },
          ],
        } as any);
      }
      if (!descuento) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descuento de la ConfiguracionEdad es requerida",
              path: "descuento",
            },
          ],
        } as any);
      }
      if (!ganancia) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La ganancia de la ConfiguracionEdad es requerida",
              path: "ganancia",
            },
          ],
        } as any);
      }
      if (!recargo) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El recargo de la ConfiguracionEdad es requerida",
              path: "recargo",
            },
          ],
        } as any);
      }

      // Validar que no existan configuraciones activas con solapamiento
      const overlap = await ConfiguracionEdad.findOne({
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
              msg: "El rango de edad se solapa con otra configuración activa",
              path: "minima/maxima",
            },
          ],
        } as any);
      }

      const configuracionEdad = await ConfiguracionEdad.create({
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
        configuracionEdad,
        "ConfiguracionEdad creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la ConfiguracionEdad"
      );
    }
  }

  static async getConfiguracionEdadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configuracionEdad = await ConfiguracionEdad.findByPk(id);

      if (!configuracionEdad) {
        return BaseService.notFound(res, "ConfiguracionEdad no encontrada");
      }

      return BaseService.success(res, configuracionEdad);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la ConfiguracionEdad"
      );
    }
  }

  static async getConfiguracionEdadByAge(req: Request, res: Response) {
    try {
      const { age } = req.params;

      const configuracionEdad = await ConfiguracionEdad.findOne({
        where: {
          activo: true,
          minima: { [Op.lte]: age }, // edad >= minima
          maxima: { [Op.gte]: age }, // edad <= maxima
        },
      });

      if (!configuracionEdad) {
        return BaseService.notFound(res, "ConfiguracionEdad no encontrada");
      }

      return BaseService.success(res, configuracionEdad);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener la ConfiguracionEdad"
      );
    }
  }

  static async updateConfiguracionEdad(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, minima, maxima, descuento, ganancia, recargo, activo } =
        req.body;

      const configuracionEdad = await ConfiguracionEdad.findByPk(id);

      if (!configuracionEdad) {
        return BaseService.notFound(res, "ConfiguracionEdad no encontrada");
      }

      // Validar que no existan configuraciones activas con solapamiento
      if (activo) {
        const overlap = await ConfiguracionEdad.findOne({
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
                msg: "El rango de edad se solapa con otra configuración activa",
                path: "minima/maxima",
              },
            ],
          } as any);
        }
      }

      const configuracionEdadModificada = await configuracionEdad.update({
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
        configuracionEdadModificada,
        "ConfiguracionEdad actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la ConfiguracionEdad"
      );
    }
  }

  static async deleteConfiguracionEdad(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const configuracionEdad = await ConfiguracionEdad.findByPk(id);

      if (!configuracionEdad) {
        return BaseService.notFound(res, "ConfiguracionEdad no encontrada");
      }

      const configuracionEdadEliminada = await configuracionEdad.update({
        activo: false,
      });

      return BaseService.success(
        res,
        configuracionEdadEliminada,
        "ConfiguracionEdad eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la ConfiguracionEdad"
      );
    }
  }
}
