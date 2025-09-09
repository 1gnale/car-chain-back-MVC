import { BaseService } from "../services/BaseService";
import { Request, Response } from "express";
import { Cliente, Persona } from "../models";

const createPersona = async (personaData: any) => {
    return await Persona.create(personaData);
};

export class ClientesController {
    static async getAllClientes(req: Request, res: Response) {
        try {
            const clientes = await Cliente.findAll({
                include: [{ model: Persona, as: 'persona' }],
                order: [['idClient', 'ASC']]
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
            // Crear la persona asociada al cliente
            const persona = await createPersona(personaData);
            if (!persona) {
                return BaseService.serverError(res, null, "Error al crear la persona");
            }

            const cliente = await Cliente.create({
                persona_id: persona.id
            });

            return BaseService.success(res, cliente, "Cliente creado exitosamente");
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
            // Actualizar la información de la persona asociada
            const persona = await Persona.findByPk(cliente.persona_id);
            if (persona) {
                await persona.update(personaData);
            } else {
                return BaseService.notFound(res, "Persona asociada no encontrada");
            }
            const clienteUpdated = await Cliente.findOne({
                include: [{ model: Persona, as: 'persona', where: { correo: email } }]
            });
            return BaseService.success(res, clienteUpdated, "Cliente actualizado exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al actualizar el cliente");
        }
    }
}