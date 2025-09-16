import { Request, Response } from "express";
import { Localidad, Provincia } from "../models";
import { BaseService } from "../services/BaseService";
import { Op } from "sequelize";

export class LocalidadesController {
    // Obtener todas las localidades con filtros
    static async getAllLocalidades(req: Request, res: Response) {
        try {
            const { page, limit, search, provincia_id, activo, codigoPostal } = req.query;
            
            // Configurar paginación si se proporciona
            const pagination: any = {};
            if (page && limit) {
                const pageNum = parseInt(page as string);
                const limitNum = parseInt(limit as string);
                pagination.limit = limitNum;
                pagination.offset = (pageNum - 1) * limitNum;
            }

            // Configurar filtros
            const whereClause: any = {};
            
            // Filtro por búsqueda de texto
            if (search) {
                whereClause[Op.or] = [
                    { descripcion: { [Op.like]: `%${search}%` } },
                    { codigoPostal: { [Op.like]: `%${search}%` } }
                ];
            }
            
            // Filtro por provincia
            if (provincia_id) {
                whereClause.provincia_id = provincia_id;
            }
            
            // Filtro por estado activo
            if (activo !== undefined) {
                whereClause.activo = activo === 'true';
            }
            
            // Filtro por código postal
            if (codigoPostal) {
                whereClause.codigoPostal = codigoPostal;
            }

            const localidades = await Localidad.findAll({
                where: whereClause,
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion', 'activo']
                }],
                order: [['descripcion', 'ASC']],
                ...pagination
            });

            return BaseService.success(
                res,
                localidades,
                "Localidades obtenidas exitosamente",
                localidades.length
            );
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener las localidades");
        }
    }

    // Obtener localidad por ID
    static async getLocalidadById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const localidad = await Localidad.findByPk(id, {
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion', 'activo']
                }]
            });
            
            if (!localidad) {
                return BaseService.notFound(res, "Localidad no encontrada");
            }
            
            return BaseService.success(res, localidad, "Localidad obtenida exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener la localidad");
        }
    }

    // Obtener localidades por provincia
    static async getLocalidadesByProvincia(req: Request, res: Response) {
        try {
            const { provinciaId } = req.params;
            const { activo = 'true' } = req.query;
            
            const whereClause: any = { provincia_id: provinciaId };
            if (activo !== undefined) {
                whereClause.activo = activo === 'true';
            }

            const localidades = await Localidad.findAll({
                where: whereClause,
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion']
                }],
                order: [['descripcion', 'ASC']]
            });

            return BaseService.success(
                res,
                localidades,
                `Localidades de la provincia obtenidas exitosamente`,
                localidades.length
            );
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener las localidades por provincia");
        }
    }

    // Crear nueva localidad
    static async createLocalidad(req: Request, res: Response) {
        try {
            const { descripcion, codigoPostal, provincia_id, activo = true } = req.body;
            
            // Verificar si la provincia existe
            const provincia = await Provincia.findByPk(provincia_id);
            if (!provincia) {
                return BaseService.validationError(res, {
                    array: () => [
                        {
                            msg: "La provincia especificada no existe",
                            path: "provincia_id",
                        },
                    ],
                } as any);
            }

            // Verificar si ya existe una localidad con la misma descripción en la provincia
            const existingLocalidad = await Localidad.findOne({
                where: {
                    descripcion: descripcion,
                    provincia_id: provincia_id
                }
            });

            if (existingLocalidad) {
                return BaseService.validationError(res, {
                    array: () => [
                        {
                            msg: "Ya existe una localidad con esta descripción en la provincia especificada",
                            path: "descripcion",
                        },
                    ],
                } as any);
            }

            // Verificar si ya existe una localidad con el mismo código postal
            const existingCodigoPostal = await Localidad.findOne({
                where: { codigoPostal: codigoPostal }
            });

            if (existingCodigoPostal) {
                return BaseService.validationError(res, {
                    array: () => [
                        {
                            msg: "Ya existe una localidad con este código postal",
                            path: "codigoPostal",
                        },
                    ],
                } as any);
            }

            const nuevaLocalidad = await Localidad.create({
                descripcion,
                codigoPostal,
                provincia_id,
                activo
            });

            // Obtener la localidad completa con la provincia
            const localidadCompleta = await Localidad.findByPk(nuevaLocalidad.id, {
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion']
                }]
            });

            return BaseService.created(res, localidadCompleta, "Localidad creada exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al crear la localidad");
        }
    }

    // Actualizar localidad
    static async updateLocalidad(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { descripcion, codigoPostal, provincia_id, activo } = req.body;
            
            const localidad = await Localidad.findByPk(id);
            if (!localidad) {
                return BaseService.notFound(res, "Localidad no encontrada");
            }

            // Si se quiere cambiar la provincia, verificar que existe
            if (provincia_id && provincia_id !== localidad.provincia_id) {
                const provincia = await Provincia.findByPk(provincia_id);
                if (!provincia) {
                    return BaseService.validationError(res, {
                        array: () => [
                            {
                                msg: "La provincia especificada no existe",
                                path: "provincia_id",
                            },
                        ],
                    } as any);
                }
            }

            // Verificar duplicados si se cambia la descripción
            if (descripcion && descripcion !== localidad.descripcion) {
                const existingLocalidad = await Localidad.findOne({
                    where: {
                        descripcion: descripcion,
                        provincia_id: provincia_id || localidad.provincia_id,
                        id: { [Op.ne]: id }
                    }
                });

                if (existingLocalidad) {
                    return BaseService.validationError(res, {
                        array: () => [
                            {
                                msg: "Ya existe otra localidad con esta descripción en la provincia",
                                path: "descripcion",
                            },
                        ],
                    } as any);
                }
            }

            // Verificar duplicados si se cambia el código postal
            if (codigoPostal && codigoPostal !== localidad.codigoPostal) {
                const existingCodigoPostal = await Localidad.findOne({
                    where: {
                        codigoPostal: codigoPostal,
                        id: { [Op.ne]: id }
                    }
                });

                if (existingCodigoPostal) {
                    return BaseService.validationError(res, {
                        array: () => [
                            {
                                msg: "Ya existe otra localidad con este código postal",
                                path: "codigoPostal",
                            },
                        ],
                    } as any);
                }
            }

            // Actualizar campos si se proporcionan
            if (descripcion !== undefined) localidad.descripcion = descripcion;
            if (codigoPostal !== undefined) localidad.codigoPostal = codigoPostal;
            if (provincia_id !== undefined) localidad.provincia_id = provincia_id;
            if (activo !== undefined) localidad.activo = activo;

            await localidad.save();

            // Obtener la localidad actualizada con la provincia
            const localidadActualizada = await Localidad.findByPk(id, {
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion']
                }]
            });

            return BaseService.success(res, localidadActualizada, "Localidad actualizada exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al actualizar la localidad");
        }
    }

    // Cambiar estado activo/inactivo
    static async updateLocalidadEstado(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { activo } = req.body;
            
            const localidad = await Localidad.findByPk(id);
            if (!localidad) {
                return BaseService.notFound(res, "Localidad no encontrada");
            }

            localidad.activo = activo;
            await localidad.save();

            const localidadActualizada = await Localidad.findByPk(id, {
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion']
                }]
            });

            return BaseService.success(
                res, 
                localidadActualizada, 
                `Localidad ${activo ? 'activada' : 'desactivada'} exitosamente`
            );
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al actualizar el estado de la localidad");
        }
    }

    // Buscar localidades por código postal
    static async getLocalidadByCodigoPostal(req: Request, res: Response) {
        try {
            const { codigoPostal } = req.params;
            
            const localidad = await Localidad.findOne({
                where: { codigoPostal: codigoPostal },
                include: [{ 
                    model: Provincia, 
                    as: 'provincia',
                    attributes: ['id', 'descripcion']
                }]
            });
            
            if (!localidad) {
                return BaseService.notFound(res, "No se encontró localidad con ese código postal");
            }
            
            return BaseService.success(res, localidad, "Localidad encontrada por código postal");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al buscar localidad por código postal");
        }
    }
}