import { Request, Response } from "express";
import PeriodoPago from "../models/PeriodoPago";
import { BaseService } from "../services/BaseService";

export class PeriodoPagoController {
  static async getAllPeriodoPago(req: Request, res: Response) {
    try {
      const periodoPago = await PeriodoPago.findAll({
        order: [["nombre", "ASC"]],
      });

      return BaseService.success(
        res,
        periodoPago,
        "Periodos de Pago obtenidos exitosamente",
        periodoPago.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los periodoPago"
      );
    }
  }

  static async createPeriodoPago(req: Request, res: Response) {
    try {
      const { nombre, cantidadMeses, descuento } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la PeriodoPago es requerida",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!cantidadMeses) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La cantidadMeses de la PeriodoPago es requerida",
              path: "cantidadMeses",
            },
          ],
        } as any);
      }
      if (!descuento) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descuento de la PeriodoPago es requerida",
              path: "descuento",
            },
          ],
        } as any);
      }

      const nuevaPeriodoPago = await PeriodoPago.create({
        nombre,
        cantidadMeses,
        descuento,
        activo: true,
      });

      return BaseService.created(
        res,
        nuevaPeriodoPago,
        "PeriodoPago creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al crear la PeriodoPago"
      );
    }
  }

  static async getPeriodoPagoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const periodoPago = await PeriodoPago.findByPk(id);

      if (!periodoPago) {
        return BaseService.notFound(res, "PeriodoPago no encontrada");
      }

      return BaseService.success(res, periodoPago);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener el periodoPago"
      );
    }
  }
  static async updatePeriodoPago(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, cantidadMeses, descuento, activo } = req.body;

      const periodoPago = await PeriodoPago.findByPk(id);

      if (!periodoPago) {
        return BaseService.notFound(res, "PeriodoPago no encontrado");
      }

      const periodoPagoModificado = await periodoPago.update({
        nombre,
        cantidadMeses,
        descuento,
        activo,
      });

      return BaseService.success(
        res,
        periodoPagoModificado,
        "PeriodoPago actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la PeriodoPago"
      );
    }
  }

  static async deletePeriodoPago(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const periodoPago = await PeriodoPago.findByPk(id);

      if (!periodoPago) {
        return BaseService.notFound(res, "PeriodoPago no encontrado");
      }

      const periodoPagoEliminada = await periodoPago.update({ activo: false });

      return BaseService.success(
        res,
        periodoPagoEliminada,
        "PeriodoPago eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la PeriodoPago"
      );
    }
  }
}
