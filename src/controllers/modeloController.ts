import { Request, Response } from "express";
import { Marca, Modelo, Version } from "../models";
import { BaseService } from "../services/BaseService";

export class ModeloController {
  static async getAllModelo(req: Request, res: Response) {
    try {
      const modelos = await Modelo.findAll({
        order: [["nombre", "ASC"]],
        include: [{ model: Marca, as: `marca` }],
      });
      const finalModel = modelos.map((model: any) => ({
        id: model.id,
        nombre: model.nombre,
        descripcion: model.descripcion,
        activo: model.activo,
        marca: {
          id: model.marca.id,
          nombre: model.marca.nombre,
          descripcion: model.marca.descripcion,
          activo: model.marca.activo,
        },
      }));
      return BaseService.success(
        res,
        finalModel,
        "Modelos obtenidos exitosamente",
        finalModel.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los Modelos"
      );
    }
  }

  static async getModeloById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const modelo = await Modelo.findByPk(id, {
        include: [{ model: Marca, as: `marca` }],
      });
      if (!modelo) {
        return BaseService.notFound(res, "Modelo no encontrado");
      }
      const marca = await Marca.findByPk(modelo.marca_id);
      if (!marca) {
        return BaseService.notFound(res, "Marca no encontrada");
      }
      const finalModel = {
        id: modelo.id,
        nombre: modelo.nombre,
        descripcion: modelo.descripcion,
        activo: modelo.activo,
        marca: {
          id: marca.id,
          nombre: marca.nombre,
          descripcion: marca.descripcion,
          activo: marca.activo,
        },
      };

      return BaseService.success(res, finalModel);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener el Modelo");
    }
  }

  static async crearModelo(req: Request, res: Response) {
    try {
      const { descripcion, nombre, marca } = req.body;

      const marca_id = marca.id;

      if (!descripcion || !nombre || !marca_id) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descripción, nombre o marca del Modelo es requerida",
              path: "descripcion, nombre, marca",
            },
          ],
        } as any);
      }

      const nuevoModelo = await Modelo.create({
        nombre,
        descripcion,
        marca_id,
        activo: true,
      });

      return BaseService.created(
        res,
        nuevoModelo,
        "Modelo creado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear el Modelo");
    }
  }

  static async updateModelo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descripcion, nombre, activo } = req.body;
      const modelo = await Modelo.findByPk(id);

      if (!modelo) {
        return BaseService.notFound(res, "Modelo no encontrado");
      }

      const modeloModificado = await modelo.update({
        descripcion,
        nombre,
        activo,
      });
      if (activo) {
        await Version.update({ activo: true }, { where: { modelo_id: id } });
      }
      return BaseService.success(
        res,
        modeloModificado,
        "Modelo actualizado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar el Modelo"
      );
    }
  }

  static async deleteModelo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const modelo = await Modelo.findByPk(id);

      if (!modelo) {
        return BaseService.notFound(res, "Modelo no encontrado");
      }

      const modeloModificado = await modelo.update({ activo: false });
      await Version.update({ activo: false }, { where: { modelo_id: id } });
      return BaseService.success(
        res,
        modeloModificado,
        "Modelo eliminado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al eliminar el modelo");
    }
  }
}
