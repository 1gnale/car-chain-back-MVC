import { Request, Response } from "express";
import { Marca, Modelo, Version } from "../models";
import { BaseService } from "../services/BaseService";
import { version } from "os";

export class VersionesController {
  static async getAllVersiones(req: Request, res: Response) {
    try {
      const versiones = await Version.findAll({
        order: [["nombre", "ASC"]],
        include: [
          {
            model: Modelo,
            as: `modelo`,
            include: [
              {
                model: Marca,
                as: `marca`,
              },
            ],
          },
        ],
      });
      const finalVersion = versiones.map((version: any) => ({
        id: version.id,
        nombre: version.nombre,
        descripcion: version.descripcion,
        precio_mercado: version.precio_mercado,
        precio_mercado_gnc: version.precio_mercado_gnc,
        activo: version.activo,
        modelo: {
          id: version.modelo.id,
          nombre: version.modelo.nombre,
          descripcion: version.modelo.descripcion,
          activo:version.modelo.activo,
          marca: {
            id: version.modelo.marca.id,
            nombre: version.modelo.marca.nombre,
            descripcion: version.modelo.marca.descripcion,
            activo: version.modelo.marca.activo,
          },
        },
      }));
      return BaseService.success(
        res,
        finalVersion,
        "Versiones obtenidas exitosamente",
        finalVersion.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener las versiones"
      );
    }
  }

  static async getVersionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const version = await Version.findByPk(id, {
        include: [
          {
            model: Modelo,
            as: `modelo`,
            include: [
              {
                model: Marca,
                as: `marca`,
              },
            ],
          },
        ],
      });
      if (!version) {
        return BaseService.notFound(res, "Version no encontrada");
      }
      const modelo = await Modelo.findByPk(version.modelo_id);
      if (!modelo) {
        return BaseService.notFound(res, `Modelo no encontrado`);
      }
      const marca = await Marca.findByPk(modelo.marca_id);
      if (!marca) {
        return BaseService.notFound(res, "Marca no encontrada");
      }
      const finalVersion = {
        id: version.id,
        nombre: version.nombre,
        descripcion: version.descripcion,
        precio_mercado: version.precio_mercado,
        precio_mercado_gnc: version.precio_mercado_gnc,
        activo: version.activo,
        modelo: {
          id: modelo.id,
          nombre: modelo.nombre,
          descripcion: modelo.descripcion,
          activo: modelo.activo,
          marca: {
            id: marca.id,
            nombre: marca.nombre,
            descripcion: marca.descripcion,
            activo: marca.activo,
          }
        },
      };

      return BaseService.success(res, finalVersion);
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener la version");
    }
  }

  static async crearVersion(req: Request, res: Response) {
    try {
      const { descripcion, nombre, modelo_id, precio_mercado, precio_mercado_gnc } = req.body;

      if (!descripcion || !nombre || !modelo_id || !precio_mercado || !precio_mercado_gnc) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "La descripción, nombre, modelo, precio_mercado o Precio_mercado_gnc del Modelo es requerida",
              path: "descripcion, nombre, modelo, precio_mercado, precio_mercado_gnc",
            },
          ],
        } as any);
      }

      const nuevaVersion = await Version.create({
        nombre,
        descripcion,
        modelo_id,
        precio_mercado,
        precio_mercado_gnc,
        activo: true,
      });

      return BaseService.created(
        res,
        nuevaVersion,
        "Version creada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear la version");
    }
  }

  static async updateVersion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descripcion, nombre, activo } = req.body;
      const version = await Version.findByPk(id);

      if (!version) {
        return BaseService.notFound(res, "Version no encontrada");
      }

      await version.update({ descripcion, nombre, activo });

      return BaseService.success(
        res,
        version,
        "Version actualizada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar la Version"
      );
    }
  }

  static async deleteVersion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const version = await Version.findByPk(id);

      if (!version) {
        return BaseService.notFound(res, "Version no encontrada");
      }

      const versionModificada = await version.update({ activo: false });
      return BaseService.success(
        res,
        versionModificada,
        "Version eliminada exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al eliminar la version"
      );
    }
  }
}
