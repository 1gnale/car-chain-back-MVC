import { Request, Response } from "express";
import { BaseService } from "../services/BaseService";
import { TipoContratacion } from "../models";

export class tipoContratacionController {
  static async getAllTipoContratacion(req: Request, res: Response) {
    try {
      const tipoContratacion = await TipoContratacion.findAll({
        order: [["nombre", "ASC"]],
      });

      return BaseService.success(
        res,
        tipoContratacion,
        "Tipo Contratacion obtenidos exitosamente",
        tipoContratacion.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los tipoContratacion"
      );
    }
  }

  static async createTipoContratacion(req: Request, res: Response) {
    try {
      const { nombre, cantidadMeses } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la TipoContratacion es requerida",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!cantidadMeses) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La cantidadMeses de la TipoContratacion es requerida",
              path: "cantidadMeses",
            },
          ],
        } as any);
      }

      const nuevaTipoContratacion = await TipoContratacion.create({
        nombre,
        cantidadMeses,
        activo: true,
      });

      return BaseService.created(
        res,
        nuevaTipoContratacion,
        "TipoContratacion creado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear el TipoContratacion"
      );
    }
  }

  static async getTipoContratacionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tipoContratacion = await TipoContratacion.findByPk(id);

      if (!tipoContratacion) {
        return BaseService.notFound(res, "TipoContratacion no encontrada");
      }

      return BaseService.success(res, tipoContratacion);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener el TipoContratacion"
      );
    }
  }
  static async updateTipoContratacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, cantidadMeses, descuento, activo } = req.body;

      const tipoContratacion = await TipoContratacion.findByPk(id);

      if (!tipoContratacion) {
        return BaseService.notFound(res, "TipoContratacion no encontrado");
      }

      const tipoContratacionModificado = await tipoContratacion.update({
        nombre,
        cantidadMeses,
        activo,
      });

      return BaseService.success(
        res,
        tipoContratacionModificado,
        "TipoContratacion actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar el TipoContratacion"
      );
    }
  }

  static async deleteTipoContratacion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tipoContratacion = await TipoContratacion.findByPk(id);

      if (!tipoContratacion) {
        return BaseService.notFound(res, "TipoContratacion no encontrado");
      }

      const tipoContratacionEliminada = await tipoContratacion.update({
        activo: false,
      });

      return BaseService.success(
        res,
        tipoContratacionEliminada,
        "TipoContratacion eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la TipoContratacion"
      );
    }
  }
}
