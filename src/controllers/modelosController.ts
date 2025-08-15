import { Request, Response } from 'express';
import { Modelo } from '../models';
import { BaseService } from '../services/BaseService';

export class ModeloController {
    static async  getModelo(req: Request, res: Response) {
        try {
            const Modelos = await Modelo.findAll({
                order: [['nombre', 'ASC'], ['descripcion', 'ASC']]
            });
            return BaseService.success(res, Modelos, 'Modelos obtenidos exitosamente', Modelos.length);
        } catch (error: any) {
            return BaseService.serverError(res, error, 'Error al obtener los Modelos');
        }
    }

      static async getModeloById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const modelo = await Modelo.findByPk(id);

      if (!modelo) {
        return BaseService.notFound(res, 'Modelo no encontrado');
      }

      return BaseService.success(res, modelo);
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al obtener el Modelo');
    }
  }

    static async crearModelo(req: Request, res: Response) {
    try {
      const { descripcion, nombre, marca_id } = req.body;

      if (!descripcion || !nombre || !marca_id) {
        return BaseService.validationError(res, {
          array: () => [{ msg: 'La descripción, nombre o marca del Modelo es requerida', path: 'descripcion, nombre, marca'  }]
        } as any);
      }

      const nuevoModelo = await Modelo.create({
        nombre,
        descripcion,
        marca_id,
        activo: true
      });

      return BaseService.created(res, nuevoModelo, 'Modelo creado exitosamente');
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al crear el Modelo');
    }
  }

    static async updateModelo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descripcion, nombre, activo } = req.body;
      const modelo = await Modelo.findByPk(id);

      if (!modelo) {
        return BaseService.notFound(res, 'Modelo no encontrado');
      }

      await modelo.update({ descripcion, nombre, activo });

      return BaseService.success(res, modelo, 'Modelo actualizado exitosamente');
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al actualizar el Modelo');
    }
  }

    static async deleteModelo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const modelo = await Modelo.findByPk(id);

      if (!modelo) {
        return BaseService.notFound(res, 'Provincia no encontrada');
      }

      const modeloModificado = await modelo.update({activo:false});

      return BaseService.success(res, modeloModificado, 'Modelo eliminado exitosamente');
    } catch (error: any) {
      return BaseService.serverError(res, error, 'Error al eliminar el modelo');
    }
  }

}

