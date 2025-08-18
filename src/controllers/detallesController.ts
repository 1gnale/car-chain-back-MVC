import { Request, Response } from "express";
import Detalle from "../models/Detalle";
import { BaseService } from "../services/BaseService";

export class DetalleController {
  static async getAllDetalles(req: Request, res: Response) {
    try {
      const detalles = await Detalle.findAll({
        order: [["nombre", "ASC"]],
      });

      return BaseService.success(
        res,
        detalles,
        "Detalles obtenidos exitosamente",
        detalles.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los detalles"
      );
    }
  }

  static async createDetalle(req: Request, res: Response) {
    try {
      const { nombre, descripcion, porcentaje_miles, monto_fijo } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre del Detalle es requerido",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!descripcion) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descripcion del Detalle es requerido",
              path: "descripcion",
            },
          ],
        } as any);
      }
      if (!porcentaje_miles) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El porcentaje en miles del Detalle es requerido",
              path: "porcentaje_miles",
            },
          ],
        } as any);
      }
      if (!monto_fijo) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El monto fijo del Detalle es requerido",
              path: "monto_fijo",
            },
          ],
        } as any);
      }

      const nuevaDetalle = await Detalle.create({
        nombre,
        descripcion,
        porcentaje_miles,
        monto_fijo,
        activo: true,
      });

      return BaseService.created(
        res,
        nuevaDetalle,
        "Detalle creado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear el Detalle");
    }
  }

  static async getDetalleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detalle = await Detalle.findByPk(id);

      if (!detalle) {
        return BaseService.notFound(res, "Detalle no encontrado");
      }

      return BaseService.success(res, detalle);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener el Detalle");
    }
  }
  static async updateDetalle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, porcentaje_miles, monto_fijo, activo } =
        req.body;

      const detalle = await Detalle.findByPk(id);

      if (!detalle) {
        return BaseService.notFound(res, "Detalle no encontrado");
      }

      const detalleModificada = await detalle.update({
        nombre,
        descripcion,
        porcentaje_miles,
        monto_fijo,
        activo,
      });

      return BaseService.success(
        res,
        detalleModificada,
        "Detalle actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Detalle"
      );
    }
  }

  static async deleteDetalle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const detalle = await Detalle.findByPk(id);

      if (!detalle) {
        return BaseService.notFound(res, "Detalle no encontrado");
      }

      const detalleEliminado = await detalle.update({ activo: false });

      return BaseService.success(
        res,
        detalleEliminado,
        "Detalle eliminado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar el detalle"
      );
    }
  }
}
