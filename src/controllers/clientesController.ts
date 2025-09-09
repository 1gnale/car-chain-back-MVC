import { BaseService } from "../services/BaseService";
import { Request, Response } from "express";
import { Cliente, Persona } from "../models";
import { Op } from "sequelize";

const createPersona = async (personaData: any) => {
    return await Persona.create(personaData);
};

export class ClientesController {
    static async getAllClientes(req: Request, res: Response) {
        try {
            const { page, limit, search, tipoDocumento, localidad_id } = req.query;
            
            // Configurar paginación si se proporciona
            const pagination: any = {};
            if (page && limit) {
                const pageNum = parseInt(page as string);
                const limitNum = parseInt(limit as string);
                pagination.limit = limitNum;
                pagination.offset = (pageNum - 1) * limitNum;
            }

            // Configurar filtros para la persona
            const personaWhereClause: any = {};
            if (search) {
                personaWhereClause[Op.or] = [
                    { nombres: { [Op.like]: `%${search}%` } },
                    { apellido: { [Op.like]: `%${search}%` } },
                    { correo: { [Op.like]: `%${search}%` } },
                    { documento: { [Op.like]: `%${search}%` } }
                ];
            }
            if (tipoDocumento) {
                personaWhereClause.tipoDocumento = tipoDocumento;
            }
            if (localidad_id) {
                personaWhereClause.localidad_id = localidad_id;
            }

            const clientes = await Cliente.findAll({
                include: [{ 
                    model: Persona, 
                    as: 'persona',
                    where: Object.keys(personaWhereClause).length > 0 ? personaWhereClause : undefined
                }],
                order: [['idClient', 'ASC']],
                ...pagination
            });

            return BaseService.success(
                res,
                clientes,
                "Clientes obtenidos exitosamente",
                clientes.length
            );
        }
        catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener los clientes");
        }
    }

    static async createCliente(req: Request, res: Response) {
        try {
            const { personaData } = req.body;
            
            // Verificar si ya existe una persona con el mismo documento o correo
            const existingPersona = await Persona.findOne({
                where: {
                    [Op.or]: [
                        { documento: personaData.documento },
                        { correo: personaData.correo }
                    ]
                }
            });

            if (existingPersona) {
                return BaseService.validationError(res, {
                    array: () => [
                        {
                            msg: "Ya existe una persona con el mismo documento o correo electrónico",
                            path: "personaData",
                        },
                    ],
                } as any);
            }

            // Crear la persona asociada al cliente
            const persona = await createPersona(personaData);
            if (!persona) {
                return BaseService.serverError(res, null, "Error al crear la persona");
            }

            const cliente = await Cliente.create({
                persona_id: persona.id
            });

            // Obtener el cliente completo con la información de la persona
            const clienteCompleto = await Cliente.findByPk(cliente.idClient, {
                include: [{ model: Persona, as: 'persona' }]
            });

            return BaseService.created(res, clienteCompleto, "Cliente creado exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al crear el cliente");
        }
    }

    static async getClienteByEmail(req: Request, res: Response) {
        try {
            const { email } = req.params;
            const cliente = await Cliente.findOne({
                include: [{ model: Persona, as: 'persona', where: { correo: email } }]
            });
            if (!cliente) {
                return BaseService.notFound(res, "Cliente no encontrado");
            }
            return BaseService.success(res, cliente, "Cliente obtenido exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener el cliente");
        }
    }

    static async updateCliente(req: Request, res: Response) {
        try {
            const { email } = req.params;
            const { personaData } = req.body;

            const cliente = await Cliente.findOne({
                include: [{ model: Persona, as: 'persona', where: { correo: email } }]
            });
            
            if (!cliente) {
                return BaseService.notFound(res, "Cliente no encontrado");
            }

            // Si se proporcionan datos de persona, verificar duplicados
            if (personaData && (personaData.documento || personaData.correo)) {
                const whereConditions = [];
                if (personaData.documento) {
                    whereConditions.push({ documento: personaData.documento });
                }
                if (personaData.correo) {
                    whereConditions.push({ correo: personaData.correo });
                }

                const existingPersona = await Persona.findOne({
                    where: {
                        [Op.or]: whereConditions,
                        id: { [Op.ne]: cliente.persona_id } // Excluir la persona actual
                    }
                });

                if (existingPersona) {
                    return BaseService.validationError(res, {
                        array: () => [
                            {
                                msg: "Ya existe otra persona con el mismo documento o correo electrónico",
                                path: "personaData",
                            },
                        ],
                    } as any);
                }
            }

            // Actualizar la información de la persona asociada
            const persona = await Persona.findByPk(cliente.persona_id);
            if (persona) {
                await persona.update(personaData);
            } else {
                return BaseService.notFound(res, "Persona asociada no encontrada");
            }

            // Obtener el cliente actualizado con la nueva información
            const clienteUpdated = await Cliente.findOne({
                include: [{ model: Persona, as: 'persona' }],
                where: { idClient: cliente.idClient }
            });

            return BaseService.success(res, clienteUpdated, "Cliente actualizado exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al actualizar el cliente");
        }
    }
}