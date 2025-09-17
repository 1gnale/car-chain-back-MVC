import { Request, Response } from "express";
import CoberturaDetalle from "../models/CoberturaDetalle";
import { BaseService } from "../services/BaseService";
import { Cobertura, Detalle } from "../models";

export class CoberturaDetalleController {
  static async getAllCoberturasDetalle(req: Request, res: Response) {
    try {
      const coberturaDetalle = await CoberturaDetalle.findAll({
        order: [["cobertura_id", "ASC"]],
        include: [
          { model: Cobertura, as: "cobertura" },
          { model: Detalle, as: "detalle" },
        ],
      });

      const coberDetalleTotal = coberturaDetalle.map((cobDet: any) => ({
        id: cobDet.id,
        cobertura: {
          id: cobDet.cobertura.id,
          nombre: cobDet.cobertura.nombre,
          descripcion: cobDet.cobertura.descripcion,
          recargoPorAtraso: cobDet.cobertura.recargoPorAtraso,
          activo: cobDet.cobertura.activo,
        },
        detalle: {
          id: cobDet.detalle.id,
          nombre: cobDet.detalle.nombre,
          descripcion: cobDet.detalle.descripcion,
          porcentaje_miles: cobDet.detalle.porcentaje_miles,
          monto_fijo: cobDet.detalle.monto_fijo,
          activo: cobDet.detalle.activo,
        },
        aplica: cobDet.aplica,
      }));

      return BaseService.success(
        res,
        coberDetalleTotal,
        "Coberturas_Detalle obtenidas exitosamente",
        coberDetalleTotal.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las Coberturas_Detalle"
      );
    }
  }

  static async getCoberturasDetalleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const coberturaDetalle = await CoberturaDetalle.findAll({
        order: [["cobertura_id", "ASC"]],
        include: [
          { model: Cobertura, as: "cobertura", where: { id: id } },

          { model: Detalle, as: "detalle" },
        ],
      });

      const coberDetalleTotal = coberturaDetalle.map((cobDet: any) => ({
        id: cobDet.id,
        cobertura: {
          id: cobDet.cobertura.id,
          nombre: cobDet.cobertura.nombre,
          descripcion: cobDet.cobertura.descripcion,
          recargoPorAtraso: cobDet.cobertura.recargoPorAtraso,
        },
        detalle: {
          id: cobDet.detalle.id,
          nombre: cobDet.detalle.nombre,
          descripcion: cobDet.detalle.descripcion,
          porcentaje_miles: cobDet.detalle.porcentaje_miles,
          monto_fijo: cobDet.detalle.monto_fijo,
          activodetalle: cobDet.detalle.activo,
        },
        aplica: cobDet.aplica,
      }));

      return BaseService.success(
        res,
        coberDetalleTotal,
        "Coberturas_Detalle de la cobertura obtenidas exitosamente",
        coberDetalleTotal.length
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

      const cobertura = await Cobertura.findByPk(cobertura_id);
      if (!cobertura) {
        return BaseService.notFound(res, "cobertura no encontrado");
      }
      const detalle = await Detalle.findByPk(detalle_id);
      if (!detalle) {
        return BaseService.notFound(res, "detalle no encontrado");
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
