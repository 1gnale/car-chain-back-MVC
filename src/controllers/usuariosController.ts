import { Request, Response } from "express";
import { Usuario, Persona } from "../models";
import { BaseService } from "../services/BaseService";

const createPersona = async (personaData: any) => {
    return await Persona.create(personaData);
};

export class UsuariosController {
    static async getAllUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await Usuario.findAll({
                include: [{ model: Persona, as: 'persona' }],
                order: [['legajo', 'ASC']],
            });
            return BaseService.success(
                res,
                usuarios,
                "Usuarios obtenidos exitosamente",
                usuarios.length
            );
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener los usuarios");
        }
    }

    static async createUsuario(req: Request, res: Response) {
        try {
            const { personaData, tipoUsuario } = req.body;
            const persona: Persona = await createPersona(personaData);
            const nuevoUsuario = await Usuario.create({
                persona_id: persona.id,
                activo: true,
                tipoUsuario
            });
            return BaseService.created(res, nuevoUsuario, "Usuario creado exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al crear el usuario");
        }
    }

    static async updateUsuarioState(req: Request, res: Response) {
        try {
            const { legajo } = req.params;
            const { state } = req.body;
            const usuario = await Usuario.findByPk(legajo);
            if (!usuario) {
                return BaseService.notFound(res, "Usuario no encontrado");
            }
            usuario.activo = state;
            await usuario.save();
            return BaseService.success(res, usuario, "Estado del usuario actualizado exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al actualizar el estado del usuario");
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { legajo } = req.params;
            const usuario = await Usuario.findByPk(legajo, {
                include: [{ model: Persona, as: 'persona' }]
            });
            if (!usuario) {
                return BaseService.notFound(res, "Usuario no encontrado");
            }
            return BaseService.success(res, usuario, "Usuario obtenido exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al obtener el usuario");
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { legajo } = req.params;
            const { personaData, tipoUsuario, activo } = req.body;
            const usuario = await Usuario.findByPk(legajo);
            if (!usuario) {
                return BaseService.notFound(res, "Usuario no encontrado");
            }
            if (personaData) {
                const persona = await Persona.findByPk(usuario.persona_id);
                if (persona) {
                    await persona.update(personaData);
                }
            }
            usuario.tipoUsuario = tipoUsuario ?? usuario.tipoUsuario;
            usuario.activo = activo ?? usuario.activo;
            await usuario.save();
            return BaseService.success(res, usuario, "Usuario actualizado exitosamente");
        } catch (error: any) {
            return BaseService.serverError(res, error, "Error al actualizar el usuario");
        }
    }
}
