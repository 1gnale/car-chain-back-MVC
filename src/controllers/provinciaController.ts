import { Request, Response } from 'express';
import Provincia from '../models/Provincia';
import { BaseService } from '../services/BaseService';

export class ProvinciaController {
  
  static async getAllProvincias(req: Request, res: Response) {
    try {
      const provincias = await Provincia.findAll({
        order: [['descripcion', 'ASC']]
      });
      
      return BaseService.success(res, provincias, 'Provincias obtenidas exitosamente', provincias.length);
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al obtener las provincias');
    }
  }

  static async getProvinciaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const provincia = await Provincia.findByPk(id);

      if (!provincia) {
        return BaseService.notFound(res, 'Provincia no encontrada');
      }

      return BaseService.success(res, provincia);
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al obtener la provincia');
    }
  }
  //kuscoa se la come

  static async createProvincia(req: Request, res: Response) {
    try {
      const { descripcion } = req.body;

      if (!descripcion) {
        return BaseService.validationError(res, {
          array: () => [{ msg: 'La descripción de la provincia es requerida', path: 'descripcion' }]
        } as any);
      }

      const nuevaProvincia = await Provincia.create({
        descripcion,
        activo: true
      });

      return BaseService.created(res, nuevaProvincia, 'Provincia creada exitosamente');
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al crear la provincia');
    }
  }

  static async updateProvincia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descripcion } = req.body;

      const provincia = await Provincia.findByPk(id);

      if (!provincia) {
        return BaseService.notFound(res, 'Provincia no encontrada');
      }

      await provincia.update({ descripcion });

      return BaseService.success(res, provincia, 'Provincia actualizada exitosamente');
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al actualizar la provincia');
    }
  }

  static async deleteProvincia(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const provincia = await Provincia.findByPk(id);

      if (!provincia) {
        return BaseService.notFound(res, 'Provincia no encontrada');
      }

      await provincia.destroy();

      return BaseService.success(res, null, 'Provincia eliminada exitosamente');
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al eliminar la provincia');
    }
  }
}
