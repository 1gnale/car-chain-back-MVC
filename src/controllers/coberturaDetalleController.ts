import { Request, Response } from "express";
import CoberturaDetalle from "../models/CoberturaDetalle";
import { BaseService } from "../services/BaseService";

export class CoberturaDetalleController {
  static async getAllCoberturasDetalle(req: Request, res: Response) {
    try {
      const coberturaDetalle = await CoberturaDetalle.findAll({
        order: [["cobertura_id", "ASC"]],
      });

      return BaseService.success(
        res,
        coberturaDetalle,
        "Coberturas_Detalle obtenidas exitosamente",
        coberturaDetalle.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las Coberturas_Detalle"
      );
    }
  }

  static async createCoberturasDetalle(req: Request, res: Response) {
    try {
      const { cobertura_id, detalle_id, aplica } = req.body;

      if (!cobertura_id) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La cobertura_id de la Coberturas_Detalle es requerido",
              path: "cobertura_id",
            },
          ],
        } as any);
      }
      if (!detalle_id) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El detalle_id de la Coberturas_Detalle es requerido",
              path: "detalle_id",
            },
          ],
        } as any);
      }
      if (aplica === undefined || aplica === null) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "Aplica de la Coberturas_Detalle es requerido",
              path: "aplica",
            },
          ],
        } as any);
      }

      const nuevaCoberturaDetalle = await CoberturaDetalle.create({
        cobertura_id,
        detalle_id,
        aplica,
      });

      return BaseService.created(
        res,
        nuevaCoberturaDetalle,
        "Coberturas_Detalle creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la Coberturas_Detalle"
      );
    }
  }

  static async updateCoberturaDetalle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cobertura_id, detalle_id, aplica } = req.body;

      const coberturaDetalle = await CoberturaDetalle.findByPk(id);

      if (!coberturaDetalle) {
        return BaseService.notFound(res, "Coberturas_Detalle no encontrado");
      }

      const coberturaModificada = await coberturaDetalle.update({
        cobertura_id,
        detalle_id,
        aplica,
      });

      return BaseService.success(
        res,
        coberturaModificada,
        "Coberturas_Detalle actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Cobertura"
      );
    }
  }
}
