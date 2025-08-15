import { Request, Response } from "express";
import Cobertura from "../models/Cobertura";
import { BaseService } from "../services/BaseService";

export class CoberturaController {
  static async getAllCoberturas(req: Request, res: Response) {
    try {
      const cobertura = await Cobertura.findAll({
        order: [["nombre", "ASC"]],
      });

      return BaseService.success(
        res,
        cobertura,
        "Coberturas obtenidas exitosamente",
        cobertura.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los Coberturas"
      );
    }
  }

  static async createCobertura(req: Request, res: Response) {
    try {
      const { nombre, descripcion, recargoPorAtraso } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la Cobertura es requerido",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!descripcion) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descripcion de la Cobertura es requerido",
              path: "descripcion",
            },
          ],
        } as any);
      }
      if (!recargoPorAtraso) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El Recargo Por Atraso de la Cobertura es requerido",
              path: "recargoPorAtraso",
            },
          ],
        } as any);
      }

      const nuevaCobertura = await Cobertura.create({
        nombre,
        descripcion,
        recargoPorAtraso,
        activo: true,
      });

      return BaseService.created(
        res,
        nuevaCobertura,
        "Cobertura creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear la Cobertura");
    }
  }

  static async getCoberturaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cobertura = await Cobertura.findByPk(id);

      if (!cobertura) {
        return BaseService.notFound(res, "Cobertura no encontrado");
      }

      return BaseService.success(res, cobertura);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener el Cobertura"
      );
    }
  }
  static async updateCobertura(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, recargoPorAtraso, activo } = req.body;

      const cobertura = await Cobertura.findByPk(id);

      if (!cobertura) {
        return BaseService.notFound(res, "Cobertura no encontrado");
      }

      const coberturaModificada = await cobertura.update({
        nombre,
        descripcion,
        recargoPorAtraso,
        activo,
      });

      return BaseService.success(
        res,
        coberturaModificada,
        "Cobertura actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Cobertura"
      );
    }
  }

  static async deleteCobertura(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cobertura = await Cobertura.findByPk(id);

      if (!cobertura) {
        return BaseService.notFound(res, "Cobertura no encontrada");
      }

      const coberturaEliminado = await cobertura.update({ activo: false });

      return BaseService.success(
        res,
        coberturaEliminado,
        "Cobertura eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la Cobertura"
      );
    }
  }
}
