import { Request, Response } from "express";
import Marca from "../models/Marca";
import { BaseService } from "../services/BaseService";

export class MarcaController {
  static async getAllMarcas(req: Request, res: Response) {
    try {
      const marcas = await Marca.findAll({
        order: [["descripcion", "ASC"]],
      });

      return BaseService.success(
        res,
        marcas,
        "Marcas obtenidas exitosamente",
        marcas.length
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener las marcas");
    }
  }

  static async createMarca(req: Request, res: Response) {
    try {
      const { nombre, descripcion } = req.body;

      if (!nombre) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "El nombre de la marca es requerida",
              path: "nombre",
            },
          ],
        } as any);
      }
      if (!descripcion) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descripcion de la marca es requerida",
              path: "descripcion",
            },
          ],
        } as any);
      }

      const nuevaMarca = await Marca.create({
        nombre,
        descripcion,
        activo: true,
      });

      return BaseService.created(res, nuevaMarca, "Marca creada exitosamente");
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear la Marca");
    }
  }

  static async getMarcaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const marca = await Marca.findByPk(id);

      if (!marca) {
        return BaseService.notFound(res, "marca no encontrada");
      }

      return BaseService.success(res, marca);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener la marca");
    }
  }
  static async updateMarca(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, activo } = req.body;

      const marca = await Marca.findByPk(id);

      if (!marca) {
        return BaseService.notFound(res, "marca no encontrada");
      }

      await marca.update({ nombre, descripcion, activo });

      return BaseService.success(res, marca, "Marca actualizada exitosamente");
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Marca"
      );
    }
  }

  static async deleteMarca(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const marca = await Marca.findByPk(id);

      if (!marca) {
        return BaseService.notFound(res, "marca no encontrada");
      }

      const marcaEliminada = await marca.update({ activo: false });

      return BaseService.success(
        res,
        marcaEliminada,
        "marca eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al eliminar la marca");
    }
  }
}
